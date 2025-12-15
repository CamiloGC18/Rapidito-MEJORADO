const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const mapService = require("../services/map.service");
const rideService = require("../services/ride.service");
const { sendMessageToSocketId } = require("../socket");

/**
 * Get active ride for the authenticated user
 * Retrieves any ride that is in pending, accepted, or ongoing state
 * Used for ride state recovery after page reloads
 */
module.exports.getActiveRide = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find an active ride for this user (pending, accepted, or ongoing)
    const activeRide = await rideModel.findOne({
      user: userId,
      status: { $in: ['pending', 'accepted', 'ongoing'] }
    }).populate({
      path: "user",
      select: "fullname email phone profileImage rating"
    }).populate({
      path: "captain",
      select: "fullname email phone profileImage rating vehicle location socketId"
    });
    
    if (!activeRide) {
      return res.status(404).json({
        message: "No active ride found"
      });
    }
    
    // Return the active ride data
    res.status(200).json({
      success: true,
      ride: activeRide
    });
    
  } catch (error) {
    console.error("Error fetching active ride:", error);
    res.status(500).json({
      message: "Error retrieving active ride",
      error: error.message
    });
  }
};

// Existing controller methods...
// Include all existing methods from the original file here

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const user = await userModel.findOne({ _id: req.user._id });
    if (user) {
      user.rides.push(ride._id);
      await user.save();
    }

    res.status(201).json(ride);

    Promise.resolve().then(async () => {
      try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log("Pickup Coordinates", pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(
          pickupCoordinates.lat,
          pickupCoordinates.lng,
          4,
          vehicleType
        );

        ride.otp = "";

        // CRITICAL: Populate ALL user fields to prevent frontend crashes
        const rideWithUser = await rideModel
          .findOne({ _id: ride._id })
          .populate({
            path: "user",
            select: "fullname email phone profileImage rating" // Ensure all needed fields are selected
          });

        // DEFENSIVE: Validate payload before emitting
        if (!rideWithUser || !rideWithUser.user) {
          console.error("Failed to populate user data for ride:", ride._id);
          return;
        }

        console.log(
          captainsInRadius.map(
            (captain) => `${captain.fullname.firstname} ${captain.fullname.lastname || ''}`
          ).join(', ')
        );
        
        captainsInRadius.forEach((captain) => {
          // DEFENSIVE: Only send to online drivers with valid socketId
          if (captain.socketId && captain.status === 'active') {
            sendMessageToSocketId(captain.socketId, {
              event: "new-ride",
              data: rideWithUser,
            });
          }
        });
      } catch (e) {
        console.error("Background task failed:", e.message);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Accept a ride by a captain
 * Changes ride status to accepted and assigns the captain to the ride
 */
module.exports.acceptRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const captain = req.captain;

  try {
    // Use the ride service to confirm this ride with this captain
    const ride = await rideService.confirmRide({ rideId, captain });

    // Return the confirmed ride data
    res.status(200).json({
      success: true,
      ride
    });

    // Notify the user that their ride was accepted
    if (ride.user && ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-accepted",
        data: {
          ride,
          captain: {
            _id: captain._id,
            fullname: captain.fullname,
            phone: captain.phone,
            vehicle: captain.vehicle,
            profileImage: captain.profileImage,
            rating: captain.rating
          }
        }
      });
    }

  } catch (error) {
    console.error("Error accepting ride:", error);
    return res.status(500).json({ 
      message: error.message || "Error accepting ride"
    });
  }
};

/**
 * Start a ride by verifying OTP
 * Changes ride status from accepted to ongoing
 */
module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const { otp } = req.body;
  const captain = req.captain;

  try {
    // Find the ride and verify it belongs to this captain
    const ride = await rideModel.findOne({
      _id: rideId,
      captain: captain._id,
      status: "accepted" // Only accepted rides can be started
    }).select("+otp");

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or not in correct status"
      });
    }

    // Verify OTP
    if (ride.otp !== otp) {
      // Increment OTP attempts for brute force prevention
      ride.otpAttempts = (ride.otpAttempts || 0) + 1;
      await ride.save();

      // Check if too many attempts
      if (ride.otpAttempts >= 5) {
        return res.status(400).json({
          message: "Too many incorrect OTP attempts. Please contact support."
        });
      }

      return res.status(400).json({
        message: "Incorrect OTP"
      });
    }

    // OTP is correct, update ride status
    ride.status = "ongoing";
    ride.otpVerifiedAt = new Date();
    await ride.save();

    // Return updated ride data
    const updatedRide = await rideModel.findById(rideId)
      .populate({
        path: "user",
        select: "fullname email phone profileImage rating socketId"
      })
      .populate({
        path: "captain",
        select: "fullname email phone profileImage rating vehicle location socketId"
      });

    res.status(200).json({
      success: true,
      message: "Ride started successfully",
      ride: updatedRide
    });

    // Notify the user that their ride has started
    if (updatedRide.user && updatedRide.user.socketId) {
      sendMessageToSocketId(updatedRide.user.socketId, {
        event: "ride-started",
        data: updatedRide
      });
    }

  } catch (error) {
    console.error("Error starting ride:", error);
    return res.status(500).json({ 
      message: "Error starting ride",
      error: error.message
    });
  }
};

/**
 * Complete a ride
 * Changes ride status from ongoing to completed
 */
module.exports.completeRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const captain = req.captain;

  try {
    // Find the ride and verify it belongs to this captain
    const ride = await rideModel.findOne({
      _id: rideId,
      captain: captain._id,
      status: "ongoing" // Only ongoing rides can be completed
    });

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or not in correct status"
      });
    }

    // Update ride status to completed
    ride.status = "completed";
    ride.completedAt = new Date();
    await ride.save();

    // Return updated ride data
    const completedRide = await rideModel.findById(rideId)
      .populate({
        path: "user",
        select: "fullname email phone profileImage rating socketId"
      })
      .populate({
        path: "captain",
        select: "fullname email phone profileImage rating vehicle location socketId"
      });

    res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      ride: completedRide
    });

    // Notify the user that their ride has been completed
    if (completedRide.user && completedRide.user.socketId) {
      sendMessageToSocketId(completedRide.user.socketId, {
        event: "ride-completed",
        data: completedRide
      });
    }

  } catch (error) {
    console.error("Error completing ride:", error);
    return res.status(500).json({ 
      message: "Error completing ride",
      error: error.message
    });
  }
};

/**
 * Cancel a ride - can be done by either user or captain
 */
module.exports.cancelRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const { cancellationReason } = req.body;
  
  // Determine if this is a user or captain cancelling
  const userType = req.userType;
  const userId = userType === 'user' ? req.user._id : req.captain._id;
  
  try {
    // Find the ride and make sure it can be cancelled by this user/captain
    const query = { _id: rideId };
    
    // Add appropriate user/captain check
    if (userType === 'user') {
      query.user = userId;
    } else if (userType === 'captain') {
      query.captain = userId;
    }
    
    // Only allow cancellation of pending, accepted or ongoing rides
    query.status = { $in: ['pending', 'accepted', 'ongoing'] };
    
    const ride = await rideModel.findOne(query);
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or cannot be cancelled"
      });
    }
    
    // Update ride status to cancelled
    ride.status = "cancelled";
    ride.cancellationDetails = {
      cancelledBy: userType,
      cancelledAt: new Date(),
      reason: cancellationReason || "No reason provided"
    };
    
    await ride.save();
    
    // Return updated ride data
    const cancelledRide = await rideModel.findById(rideId)
      .populate({
        path: "user",
        select: "fullname email phone profileImage rating socketId"
      })
      .populate({
        path: "captain",
        select: "fullname email phone profileImage rating vehicle location socketId"
      });
    
    res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      ride: cancelledRide
    });
    
    // Notify the other party about the cancellation
    const otherParty = userType === 'user' ? cancelledRide.captain : cancelledRide.user;
    if (otherParty && otherParty.socketId) {
      sendMessageToSocketId(otherParty.socketId, {
        event: "ride-cancelled",
        data: {
          ride: cancelledRide,
          cancelledBy: userType
        }
      });
    }
    
  } catch (error) {
    console.error("Error cancelling ride:", error);
    return res.status(500).json({ 
      message: "Error cancelling ride",
      error: error.message
    });
  }
};

/**
 * Get ride history for the authenticated user or captain
 */
module.exports.getRideHistory = async (req, res) => {
  try {
    const userType = req.userType;
    const userId = userType === 'user' ? req.user._id : req.captain._id;
    
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    // Create query based on user type
    const query = {};
    if (userType === 'user') {
      query.user = userId;
    } else if (userType === 'captain') {
      query.captain = userId;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Get total count for pagination
    const totalRides = await rideModel.countDocuments(query);
    
    // Get rides with pagination
    const rides = await rideModel.find(query)
      .populate({
        path: "user",
        select: "fullname email phone profileImage rating"
      })
      .populate({
        path: "captain",
        select: "fullname email phone profileImage rating vehicle"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      rides,
      pagination: {
        total: totalRides,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalRides / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return res.status(500).json({ 
      message: "Error retrieving ride history",
      error: error.message
    });
  }
};

/**
 * Rate a completed ride
 */
module.exports.rateRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const { rating, comment } = req.body;
  const userType = req.userType;
  
  try {
    // Find the ride
    const ride = await rideModel.findOne({
      _id: rideId,
      status: "completed" // Only completed rides can be rated
    });
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or cannot be rated"
      });
    }
    
    // Verify that the current user/captain is part of this ride
    if (userType === 'user' && ride.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to rate this ride"
      });
    }
    
    if (userType === 'captain' && ride.captain.toString() !== req.captain._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to rate this ride"
      });
    }
    
    // Update the rating based on who is rating
    if (userType === 'user') {
      // User rating captain
      ride.rating = ride.rating || {};
      ride.rating.userToCaptain = {
        stars: rating,
        comment: comment || "",
        createdAt: new Date()
      };
      
      // Update captain's average rating
      const captain = await captainModel.findById(ride.captain);
      if (captain) {
        const ratings = await rideModel.find({
          captain: ride.captain,
          'rating.userToCaptain.stars': { $exists: true }
        });
        
        const totalRatings = ratings.length;
        const ratingSum = ratings.reduce((sum, r) => sum + r.rating.userToCaptain.stars, 0);
        
        captain.rating = captain.rating || {};
        captain.rating.average = totalRatings > 0 ? (ratingSum / totalRatings) : 0;
        captain.rating.count = totalRatings;
        
        await captain.save();
      }
    } else {
      // Captain rating user
      ride.rating = ride.rating || {};
      ride.rating.captainToUser = {
        stars: rating,
        comment: comment || "",
        createdAt: new Date()
      };
      
      // Update user's average rating
      const user = await userModel.findById(ride.user);
      if (user) {
        const ratings = await rideModel.find({
          user: ride.user,
          'rating.captainToUser.stars': { $exists: true }
        });
        
        const totalRatings = ratings.length;
        const ratingSum = ratings.reduce((sum, r) => sum + r.rating.captainToUser.stars, 0);
        
        user.rating = user.rating || {};
        user.rating.average = totalRatings > 0 ? (ratingSum / totalRatings) : 0;
        user.rating.count = totalRatings;
        
        await user.save();
      }
    }
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      message: "Rating submitted successfully"
    });
    
  } catch (error) {
    console.error("Error rating ride:", error);
    return res.status(500).json({ 
      message: "Error submitting rating",
      error: error.message
    });
  }
};

/**
 * Add a message to the ride chat
 */
module.exports.addMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.params;
  const { message } = req.body;
  const userType = req.userType;
  
  try {
    // Find the ride and verify it's active
    const ride = await rideModel.findOne({
      _id: rideId,
      status: { $in: ['accepted', 'ongoing'] }
    });
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found or not in active state"
      });
    }
    
    // Verify user/captain is part of this ride
    if (userType === 'user' && ride.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to message in this ride"
      });
    }
    
    if (userType === 'captain' && ride.captain.toString() !== req.captain._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to message in this ride"
      });
    }
    
    // Create message object
    const now = new Date();
    const messageObj = {
      msg: message,
      by: userType,
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      timestamp: now
    };
    
    // Add message to ride
    ride.messages.push(messageObj);
    await ride.save();
    
    res.status(201).json({
      success: true,
      message: "Message added successfully",
      chatMessage: messageObj
    });
    
    // Send message to other party via socket
    const otherParty = userType === 'user' ? ride.captain : ride.user;
    const otherPartyModel = userType === 'user' ? captainModel : userModel;
    
    const recipient = await otherPartyModel.findById(otherParty);
    if (recipient && recipient.socketId) {
      sendMessageToSocketId(recipient.socketId, {
        event: "new-message",
        data: {
          rideId: ride._id,
          message: messageObj
        }
      });
    }
    
  } catch (error) {
    console.error("Error adding message:", error);
    return res.status(500).json({ 
      message: "Error sending message",
      error: error.message
    });
  }
};
