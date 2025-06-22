"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
const axios = require("axios");

// --- Configuration ---

// Centralized place for your bot's branding and channel information
const botName = "𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ";
const channelUrl = "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10";

// Array of 5 random audio URLs
const audioUrls = [
  "https://files.catbox.moe/4yqp5m.mp3",
  "https://files.catbox.moe/ddmjyy.mp3",
  "https://files.catbox.moe/jrfk1n.mp3",
  "https://files.catbox.moe/mexjrq.mp3",
  "https://files.catbox.moe/k41qij.mp3"
];

// Array of random image URLs
const images = [
  "https://files.catbox.moe/og4tsk.jpg",
  "https://files.catbox.moe/95n1x6.jpg",
  "https://files.catbox.moe/0w7hqx.jpg",
  "https://files.catbox.moe/etqc8k.jpg",
  "https://files.catbox.moe/8k0enh.jpg",
  "https://files.catbox.moe/6g5aq0.jpg"
];

// List of motivational quotes or facts
const factsOrQuotes = [
  "✨ Did you know? The first computer programmer was Ada Lovelace in 1843!",
  "💡 Success is not final; failure is not fatal: It is the courage to continue that counts.",
  "🌟 Keep going, you're closer to your goals than you think!",
  "🔥 Tip: Automate the boring stuff to focus on the creative!",
  "🌐 Fun Fact: The first email was sent in 1971 by Ray Tomlinson.",
  "🚀 The best way to predict the future is to invent it."
];

// --- End of Configuration ---

zokou(
  { 
    nomCom: "alive", 
    alias: ["test"], // Merged 'test' command as an alias
    reaction: "🪄", 
    nomFichier: __filename 
  },
  async (dest, zk, commandeOptions) => {
    console.log("Alive command triggered!");

    const contactName = commandeOptions?.ms?.pushName || "User";
    const hour = new Date().getHours();

    // Dynamic greeting based on the time of day
    const greeting =
      hour < 12
        ? "Good Morning 🌅"
        : hour < 18
        ? "Good Afternoon ☀️"
        : "Good Evening 🌠";

    try {
      // --- Randomly select content ---
      const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomFactOrQuote = factsOrQuotes[Math.floor(Math.random() * factsOrQuotes.length)];

      // Verify if the audio URL is accessible before sending
      const audioResponse = await axios.head(randomAudioUrl);
      if (audioResponse.status !== 200) {
        throw new Error("Audio file not found or inaccessible!");
      }

      // Generate a unique emoji sequence from the contact's name
      const emojis = [...new Set(contactName.split(""))]
        .map((char) => String.fromCodePoint(0x1f600 + (char.charCodeAt(0) % 48)))
        .join("");

      // Content for the rich reply using the new botName
      const externalAdReply = {
        title: botName,
        body: `Hello, ${contactName}! Tap here to join our channel!`,
        thumbnailUrl: randomImage,
        sourceUrl: channelUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
      };
      
      const caption = `${greeting} *${contactName}*,\n\n${randomFactOrQuote}\n\nI am *${botName}*, always at your service.\n\n${emojis}`;

      // Send the complete message with image, caption, and audio
      await zk.sendMessage(dest, {
        audio: { url: randomAudioUrl },
        mimetype: "audio/mpeg",
        ptt: true, // Send as a push-to-talk voice note
        contextInfo: {
          externalAdReply,
        },
        caption: caption,
        image: { url: randomImage },
      });

      console.log("Alive message sent successfully with new branding.");
    } catch (error) {
      console.error("Error sending Alive message:", error.message);
      // Send a fallback error message to the user
      await zk.sendMessage(dest, { text: "❌ Oops! Something went wrong while trying to wake up. Please try again later." });
    }
  }
);

console.log("✅ Alive command loaded and ready!");
