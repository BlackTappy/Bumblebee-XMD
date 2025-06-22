const axios = require('axios');
// const config = require('../config'); // Not used directly in this command, keep if needed elsewhere
// const { cmd, commands } = require('../command'); // Remove these imports as we are converting to zokou
const { zokou } = require("../framework/zokou"); // Import zokou
const { downloadMediaMessage } = require('../lib/msg'); // Assuming this utility is still available
const fs = require("fs"); // Keep fs if you need it for file operations (not strictly needed for this version)

zokou({
  nomCom: "save",
  categorie: "Util", // Renamed category to "Util" as per zokou common practice, or "Utility"
  reaction: "💾", // Added a reaction emoji
  // No need for filename or desc here as zokou handles it differently,
  // description is usually in the nomCom comment or in the help message.
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, superUser } = commandeOptions; // zokou uses ms for the main message object
                                                        // superUser is zokou's equivalent of isOwner

  // Check if the sender is an owner/superuser
  if (!superUser) { // Using superUser which typically checks config.js owner numbers
    return repondre("❌ You are not authorized to use this command.");
  }

  try {
    // Check if a message is quoted (replied to)
    if (!ms.quoted) {
      return repondre("Please reply to a status, photo, or video message to save it.");
    }

    // Access the quoted message directly from ms.quoted
    const quotedMessage = ms.quoted;

    // Extract the mimetype from the quoted message
    let mime = (quotedMessage.mimetype || "");
    console.log("Extracted mimetype:", mime); // Debugging: Log the mimetype

    let mediaType = "";
    if (mime.startsWith("image")) {
      mediaType = "image";
    } else if (mime.startsWith("video")) {
      mediaType = "video";
    } else if (mime.startsWith("audio")) {
      mediaType = "audio";
    } else {
      console.log("Unsupported mimetype detected:", mime); // Debugging: Log unsupported mimetype
      return repondre("❌ Unsupported media type. Please reply to a status, photo, or video message (image, video, or audio).");
    }

    // Download the media using the downloadMediaMessage function
    // Ensure downloadMediaMessage is compatible with zokou's message object structure
    const mediaBuffer = await downloadMediaMessage(quotedMessage);
    if (!mediaBuffer) {
      return repondre("❌ Failed to download the media.");
    }

    // Prepare the message options based on the media type
    let messageOptions = {};
    if (mediaType === "image") {
      messageOptions = { image: mediaBuffer, mimetype: mime };
    } else if (mediaType === "video") {
      messageOptions = { video: mediaBuffer, mimetype: mime };
    } else if (mediaType === "audio") {
      messageOptions = { audio: mediaBuffer, mimetype: mime };
    }

    // Send the media to the owner's private chat (ms.sender is the sender's JID)
    await zk.sendMessage(ms.sender, messageOptions, { quoted: ms }); // Quoting the original command message
    repondre("✅ Media saved and sent to your private chat!");

  } catch (error) {
    console.error("Error in save command:", error); // Debugging: Log the error
    repondre("❌ An error occurred while saving the media.");
  }
});
