const { zokou } = require(__dirname + "/../framework/zokou");

zokou(
  {
    nomCom: "repo",
    categorie: "General",
    reaction: "📦",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    try {
      const repoLink = "https://github.com/Black-Tappy/Bumblebee-XMD";
      const imageUrl = "https://files.catbox.moe/8k0enh.jpg"; // ✅ WORKING fallback image

      const caption = `
╭┈〔 🛠️ *BUMBLEBEE-XTECH REPO* 〕┈╮
├┈┈┈┈•➤
📁 *Bot Name:* Bumblebee-XMD
🌐 *GitHub:* ${repoLink}  
🛠️ *Developer:* @254759000340
⚙️ *Framework:* Baileys  
✨ *Fast, Clean & Reliable*
├┈┈┈┈•➤
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯
`;

      const sender = ms.key.participant || ms.key.remoteJid;

      await zk.sendMessage(
        dest,
        {
          image: { url: imageUrl },
          caption,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363369453603973@newsletter",
              newsletterName: "𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ",
              serverMessageId: 152,
            },
          },
        },
        { quoted: ms }
      );
    } catch (e) {
      console.error("Error in repo command:", e);
      repondre(`❌ Failed to load repo:\n${e.message}`);
    }
  }
);
