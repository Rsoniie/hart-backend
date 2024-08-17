// Assume we have Mongoose models defined for User and Action
const express = require('express');
const Action = require('../model/userAction');
const router = express.Router();
const User = require("../model/user");
const admin = require('../realate-dating-firebase-adminsdk-3vzse-e24eb8caca.json')


// function to send notification
async function sendNotification(token, title, body) {
  const notificationPayload = {
      notification: {
          title: title,
          body: body,
      },
      android: {
          priority: "high",
          notification: {
              channel_id: "default",
              priority: "high",
              icon: "logo",
          },
      },
      apns: {
          payload: {
              aps: {
                  alert: {
                      title: title,
                      body: body,
                  },
                  sound: "default",
              },
          },
      },
      token: token,
  };

  try {
      const response = await admin.messaging().send(notificationPayload);
      console.log("Notification sent:", response);
  } catch (error) {
      console.error("Error sending notification:", error);
  }
}


// Endpoint to handle user actions (like, remove, report)
router.post('/', async (req, res) => {
    const { firebaseUid, targetFirebaseUid, actionType, reply, prompts } = req.body;
    console.log(req.body)
    //console.log(req.user.firebaseUid)
    // Retrieved from the authenticated user session
  
    try {
        let action = await Action.findOne({ firebaseUid, targetFirebaseUid });

        if (action) {
          // If the action exists, update it with the new actionType, reply, and prompts
          action.actionType = actionType;
          action.reply = reply;
          action.prompts = prompts;
          action.timestamp = new Date(); // Update the timestamp to reflect the modification time
        } else {
          // If the action does not exist, create a new one
          action = new Action({
            firebaseUid,
            targetFirebaseUid,
            actionType,
            reply,
            prompts,
            timestamp: new Date(),
          });
        }

      await action.save();

      // If the action is a "like", update the target user's likesReceived
      if (actionType === 'like') {
        await User.updateOne(
            { firebaseUid: targetFirebaseUid }, 
            { $addToSet: { likesReceived: firebaseUid } } // Use $addToSet to avoid duplicates
        );

        const targetUser = await User.findOne({ firebaseUid: targetFirebaseUid });
        const liker_User = await User.findOne({ firebaseUid: firebaseUid });
         if (targetUser && targetUser.fcmToken) {
                // Send a notification to the target user
                await sendNotification(targetUser.fcmToken, "New Like!", `${liker_User.name} just liked your profile!`);
            }
        
        
      }
      res.status(200).json({ message: `Action ${actionType} performed successfully.` });
    } catch (error) {
      console.error('Error performing action:', error);
      res.status(500).json({ message: 'Error performing action' });
    }
});


// Route to handle when two users are matched
router.post('/match', async (req, res) => {
  const { firebaseUid1, firebaseUid2 } = req.body;

  try {

      // Retrieve both users' FCM tokens
      const user1 = await User.findOne({ firebaseUid: firebaseUid1 });
      const user2 = await User.findOne({ firebaseUid: firebaseUid2 });

      // Send notifications to both users
      if (user1 && user1.fcmToken) {
          await sendNotification(user1.fcmToken, "It's a Match!", "You've matched with someone!");
      }

      if (user2 && user2.fcmToken) {
          await sendNotification(user2.fcmToken, "It's a Match!", "You've matched with someone!");
      }

      res.status(200).json({ message: "Users matched successfully." });
  } catch (error) {
      console.error('Error matching users:', error);
      res.status(500).json({ message: 'Error matching users' });
  }
});



module.exports = router;
  
  