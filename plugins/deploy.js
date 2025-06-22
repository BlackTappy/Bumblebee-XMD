const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "deploy", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, nomAuteurMessage, mybotpic } = commandeOptions;
  const { cm } = require(__dirname + "/../framework/zokou");

  let coms = {};
  let mode = (s.MODE.toLowerCase() === "yes") ? "public" : "private";

  for (const com of cm) {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  }

  moment.tz.setDefault('Etc/GMT');
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  const infoMsg = `
╭─「 *🚀 BOT DEPLOYMENT GUIDE* 」─╮
>  Hello *${nomAuteurMessage}*, welcome!
>  Here's how you can deploy your own version of 
>  the *Bumblebee-XMD WhatsApp Bot* 🧠⚙️
╰─────────────────────

╭─「 *🔑 GET SESSION ID* 」─╮
> 📌 Visit: https://bumblebee-sessions-generator-uk7z.onrender.com  
> ➡️ Tap on *Pair Code*

> 🧭 Enter your number with country code (e.g., *254759000340*)
> 📩 You’ll receive a login code from *Black-Tappy*
> 🛠️ Paste the code in WhatsApp when prompted
> 📬 After successful login, check your own DM — the *Session ID* will be there!
> 🔐 Copy it — you'll use it to deploy your bot.

╭─「 *📦 DEPLOYING THE BOT* 」─╮
>1️⃣ Go to the *Bumblebee-XMD* repository on GitHub  
    ⭐ Fork and give it a star — it's a must!

> 2️⃣ Tap the *Heroku Deploy* button on the repo  
> 3️⃣ Input your:
    🔹 Heroku API Key  
    🔹 Heroku App Name  
    🔹 Session ID from earlier  

> 4️⃣ Click *Deploy* — it’ll start building!  
> ⏳ Logs may not show immediately, but be patient!  
> 🚀 In a few moments, your bot will go live.

╭─「 *👑 GIVE CREDITS* 」─╮
> 💬 Contact the Dev: https://wa.me/+254759000340  
> 🤝 Say thanks to *POPKID* — creator of this awesome base!

━━━━━━━━━━━━━━━━━━━━━
>     💠 *Regards — Black-Tappy😇*
━━━━━━━━━━━━━━━━━━━━━`;

  try {
    const lien = mybotpic();

    if (lien.match(/\.(mp4|gif)$/i)) {
      await zk.sendMessage(dest, {
        video: { url: lien },
        caption: infoMsg,
        footer: "🤖 Powered by *Black-Tappy* • Made with love🩷",
        gifPlayback: true
      }, { quoted: ms });

    } else if (lien.match(/\.(jpeg|jpg|png)$/i)) {
      await zk.sendMessage(dest, {
        image: { url: lien },
        caption: infoMsg,
        footer: "🤖 Powered by *Black-Tappy* • Made with love 🩷"
      }, { quoted: ms });

    } else {
      await repondre(infoMsg);
    }

  } catch (e) {
    console.error("🥵 Menu Error:", e);
    await repondre("🥵 An error occurred while sending the deployment guide.\n\n" + e.message);
  }
});

---

## Adding Random Image and Audio Commands

// Function to get a random file from a directory
function getRandomFile(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);
        const filteredFiles = files.filter(file => !file.startsWith('.')); // Exclude hidden files
        if (filteredFiles.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * filteredFiles.length);
        return path.join(directoryPath, filteredFiles[randomIndex]);
    } catch (error) {
        console.error(`Error reading directory ${directoryPath}:`, error);
        return null;
    }
}

// Define the paths to your media directories
const tappyImagesDir = path.join(__dirname, '..', 'tappy_images');
const tappyAudiosDir = path.join(__dirname, '..', 'tappy_audios');

// Command for random image
zokou({ nomCom: "tappyimg", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const randomImagePath = getRandomFile(tappyImagesDir);

    if (randomImagePath) {
        try {
            await zk.sendMessage(dest, { image: { url: randomImagePath } }, { quoted: ms });
        } catch (e) {
            console.error("🥵 Error sending random image:", e);
            await repondre("🥵 Failed to send a random image. " + e.message);
        }
    } else {
        await repondre("🥵 No images found in the tappy_images directory.");
    }
});

// Command for random audio
zokou({ nomCom: "tappyaudio", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;
    const randomAudioPath = getRandomFile(tappyAudiosDir);

    if (randomAudioPath) {
        try {
            await zk.sendMessage(dest, { audio: { url: randomAudioPath }, mimetype: 'audio/mpeg', ptt: true }, { quoted: ms });
        } catch (e) {
            console.error("🥵 Error sending random audio:", e);
            await repondre("🥵 Failed to send a random audio. " + e.message);
        }
    } else {
        await repondre("🥵 No audios found in the tappy_audios directory.");
    }
});
