const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");

const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const s = require(__dirname + "/../set");

// --- Configuration ---
// Array of 5 random image URLs for the menu command
const menuImages = [
  'https://files.catbox.moe/og4tsk.jpg',
  'https://files.catbox.moe/0w7hqx.jpg',
  'https://files.catbox.moe/8k0enh.jpg',
  'https://files.catbox.moe/6g5aq0.jpg',
  'https://files.catbox.moe/6g5aq0.jpg'
];

// Cyber-styled dividers for the menu
const topDivider = "▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃";
const categoryDivider = "━━━━━━━━━━━━━━";
// --- End of Configuration ---

/**
 * Generates the bot's system information string.
 * @param {string} mode - The bot's current operating mode ('public' or 'private').
 * @returns {string} A formatted string of the bot's status.
 */
function getBotInfo(mode) {
  moment.tz.setDefault("EAT"); // East Africa Time
  const currentTime = moment().format("HH:mm:ss");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `
╭┈〔 🚀 *BUMBLEBEE-XTECH SYSTEM* 〕┈╮
├┈┈┈┈•➤
│ 🟢 *Status:* ONLINE
│ ⚒️ *Mode:* ${mode.toUpperCase()}
│ ⏱ *Time:* ${currentTime} (EAT)
│ 🪀 *Dev:* @254759000340
│ 🖥 *RAM:* ${usedRAM} / ${totalRAM}
├┈┈┈┈•➤
╰┈${topDivider}┈╯
`;
}

/**
 * Builds the command menu string from available commands.
 * @param {object} coms - An object with command categories and lists.
 * @param {string} prefixe - The current command prefix.
 * @returns {string} The fully formatted menu string.
 */
function buildMenu(coms, prefixe) {
  let menu = `
🧾 *COMMAND INDEX*
🔎 Use: *${prefixe}help* to get command info
${categoryDivider}
`;

  const categoryStyles = {
    General: "🌐",
    Group: "👥",
    Mods: "🛡️",
    Fun: "🎉",
    Search: "🔎",
    Logo: "🎨",
    Utilities: "🧰",
    Adult: "🔞",
    Download: "📥",
  };

  for (const cat in coms) {
    const icon = categoryStyles[cat] || "✨";
    menu += `\n${icon} *${cat.toUpperCase()}*\n`;
    coms[cat].forEach((cmd) => {
      menu += `┣ ⚫ *${prefixe}${cmd}*\n`;
    });
    menu += categoryDivider + "\n";
  }

  menu += `
🧭 *DEVELOPERS*
 ┗ @254759000340 (Main Dev)
 ┗ @254756360306 (Shadow-Xtech Team)

📡 Powered by *Bunblebee-XMD System*
${topDivider}
`;

  return menu;
}

/**
 * Sends a menu with media (image or video).
 * @param {object} zk - The bot instance.
 * @param {string} dest - The destination JID.
 * @param {object} ms - The message object to quote.
 * @param {string} mediaUrl - The URL of the image or video.
 * @param {string} caption - The text caption for the media.
 * @param {string[]} mentions - An array of JIDs to mention.
 */
async function sendMenuMedia(zk, dest, ms, mediaUrl, caption, mentions) {
  try {
    if (mediaUrl.match(/\.(mp4|gif)$/i)) {
      await zk.sendMessage(dest, {
        video: { url: mediaUrl },
        caption,
        footer: "®2025 𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ",
        mentions,
        gifPlayback: true,
      }, { quoted: ms });
    } else if (mediaUrl.match(/\.(jpeg|jpg|png)$/i)) {
      await zk.sendMessage(dest, {
        image: { url: mediaUrl },
        caption,
        footer: "®2025 𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ",
        mentions,
      }, { quoted: ms });
    } else {
      // Fallback to text if the URL is not an image or video
      await sendForwardedText(zk, dest, ms, caption, mentions[0]);
    }
  } catch (e) {
    console.error("Error sending menu media, falling back to text:", e);
    await sendForwardedText(zk, dest, ms, caption, mentions[0]);
  }
}

/**
 * Sends a text message styled as a forwarded message from a WhatsApp Channel.
 * @param {object} zk - The bot instance.
 * @param {string} dest - The destination JID.
 * @param {object} ms - The message object to quote.
 * @param {string} text - The text to send.
 * @param {string} sender - The sender's JID to mention.
 */
async function sendForwardedText(zk, dest, ms, text, sender) {
  await zk.sendMessage(dest, {
    text,
    contextInfo: {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363369453603973@newsletter",
        newsletterName: "Ᏼᴜᴍʙʟᴇʙᴇᴇ-ХᴍᎠ",
        serverMessageId: 1,
      },
    },
  }, { quoted: ms });
}

/**
 * Sends a random voice note from a local directory.
 * @param {object} zk - The bot instance.
 * @param {string} dest - The destination JID.
 * @param {object} ms - The message object to quote.
 * @param {function} repondre - The reply function for error handling.
 */
async function sendRandomVoiceNote(zk, dest, ms, repondre) {
  const folder = path.join(__dirname, "../tappy_audios/"); // Note: your folder is named tappy_audios
  if (!fs.existsSync(folder)) {
    return console.log(`Audio folder not found at: ${folder}`);
  }

  const audioFiles = fs.readdirSync(folder).filter((f) => f.endsWith(".mp3"));
  if (!audioFiles.length) {
    return console.log(`No audio files (.mp3) found in folder.`);
  }

  const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const audioPath = path.join(folder, randomAudio);

  await zk.sendMessage(dest, {
    audio: { url: audioPath },
    mimetype: "audio/mpeg",
    ptt: true,
    fileName: `🗣 BUMBLEBEE-XMD VOICE`,
  }, { quoted: ms });
}

// --- Main Menu Command ---
zokou(
  {
    nomCom: "menu",
    categorie: "General",
    reaction: "⚡",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");

    let coms = {};
    const mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

    // Categorize all available commands
    cm.forEach(com => {
      if (!coms[com.categorie]) {
        coms[com.categorie] = [];
      }
      coms[com.categorie].push(com.nomCom);
    });

    try {
      const infoText = getBotInfo(mode);
      const menuText = buildMenu(coms, prefixe);
      const finalText = infoText + menuText;
      const sender = ms.key.participant || ms.key.remoteJid;

      // **MODIFICATION**: Select a random image URL from the array
      const randomImageUrl = menuImages[Math.floor(Math.random() * menuImages.length)];

      if (randomImageUrl) {
        await sendMenuMedia(zk, dest, ms, randomImageUrl, finalText, [sender, "254759000340", "254756360306", "254111385747"]);
      } else {
        // Fallback if the image array is empty for some reason
        await sendForwardedText(zk, dest, ms, finalText, sender);
      }

      // Send a random voice note after the menu
      await sendRandomVoiceNote(zk, dest, ms, repondre);

    } catch (err) {
      console.error(`[MENU COMMAND ERROR]: ${err}`);
      repondre(`❌ An unexpected error occurred while loading the menu.\n*Error:* ${err.message}`);
    }
  }
);
