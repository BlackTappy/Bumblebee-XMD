const { zokou } = require(__dirname + "/../framework/zokou");

zokou(
  {
    nomCom: "tagall",
    categorie: "Group",
    reaction: "📣",
  },
  async (from, conn, options) => {
    const {
      ms,
      reply,
      participants,
      sender,
      command,
      prefixe,
      isGroup,
      groupAdmins,
      senderNumber,
    } = options;

    try {
      if (!isGroup) return reply("❌ *This command is for groups only.*");

      const botOwner = conn.user.id.split(":")[0];
      const senderJid = `${senderNumber}@s.whatsapp.net`;

      if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
        return reply("🚫 *Only group admins or the bot owner can use this.*");
      }

      const groupInfo = await conn.groupMetadata(from).catch(() => null);
      if (!groupInfo) return reply("⚠️ *Couldn't fetch group information.*");

      const groupName = groupInfo.subject || "Unnamed Group";
      const totalMembers = participants?.length || 0;
      if (totalMembers === 0) return reply("⚠️ *No members found.*");

      const emojis = ['🚨', '📢', '🎯', '⚠️', '🔥', '🚀', '🎉', '🔊', '🧨'];
      const flair = emojis[Math.floor(Math.random() * emojis.length)];

      let message = (ms.body || "").slice((prefixe + command).length).trim();
      if (!message) message = "*Attention Everyone!*";

      const senderName = ms.pushName || "Unknown";
      const mentionList = participants.map(p => p.id);
      const mentionTags = participants.map(p => `➤ @${p.id.split("@")[0]}`).join("\n");

      const finalText = `
╭──〔 ${flair} *ALERT SYSTEM ENGAGED* ${flair} 〕──╮
│ 🏷 *Group:* ${groupName}
│ 👥 *Members:* ${totalMembers}
│ 👤 *By:* @${sender.split("@")[0]}
│ 💬 *Message:* ${message}
╰──〔 🪀 𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ 🪀 〕──╯

${mentionTags}

🔗 *Everyone has been mentioned.*
`;

      await conn.sendMessage(
        from,
        {
          text: finalText,
          contextInfo: {
            mentionedJid: mentionList,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363369453603973@newsletter',
              newsletterName: '𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ',
              serverMessageId: 143,
            },
          },
        },
        { quoted: ms }
      );
    } catch (e) {
      console.error("TagAll Error:", e);
      reply(`❌ *An error occurred!*\n\n${e.message || e}`);
    }
  }
);
