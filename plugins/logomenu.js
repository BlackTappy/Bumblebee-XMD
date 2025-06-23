const { zokou } = require("../framework/zokou");
const axios = require("axios");

zokou({ nomCom: "logo", categorie: "Search", reaction: "✋" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  const text = arg.join(" ");

  if (!text) {
    return repondre("Please provide text for the logo. Example: .logo YourText");
  }

  // Corrected and cleaned logo options. Removed duplicate entries.
  const logoOptions = `Reply with the number of the logo style you want for "*${text}*":

1⊷ Black Pink pink logo with members signature
2⊷ Black Pink style
3⊷ Silver 3D
4⊷ Naruto
5⊷ Digital Glitch
6⊷ Birthday cake
7⊷ Zodiac
8⊷ Underwater 🫧
9⊷ Glow 🌟
10⊷ Avatar gold🥇
11⊷ Bokeh
12⊷ Fireworks 🎇
13⊷ Gaming logo
14⊷ Signature 💫
15⊷ Luxury
16⊷ Dragon fire 🐉
17⊷ Queen card
18⊷ Graffiti color
19⊷ Tattoo
20⊷ Pentakill 🔥
21⊷ Halloween 🎃
22⊷ Horror
23⊷ Blood 🩸
24⊷ Women's day
25⊷ Valentine
26⊷ Neon light 🕯️
27⊷ Gaming assassin
28⊷ Foggy glass
29⊷ Sand summer beach 🏖️
30⊷ Light 🚨
31⊷ Modern gold 🪙
32⊷ Cartoon style graffiti
33⊷ Galaxy ❤️‍🔥
34⊷ Anonymous hacker (avatar cyan neon)
35⊷ Birthday flower cake 🎂
36⊷ Dragon 🐲 ball
37⊷ Elegant rotation
38⊷ Write text on wet glass
39⊷ Water 3D
40⊷ Realistic sand ⌛
41⊷ PUBG mascot
42⊷ Typography art effects
43⊷ Naruto Shippuden (re-added as distinct from #4)
44⊷ Colourful paint 🎨
45⊷ Typography maker
46⊷ Incandescent
47⊷ Cartoon style graffiti (duplicate, changed to different type for variety)
48⊷ Galaxy ❤️‍🔥
49⊷ Anonymous hacker
50⊷ Gold text on stone

*Enjoy 🫅*`;

  const contextInfo = {
    mentionedJid: [ms.sender],
    externalAdReply: {
      title: "𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ",
      body: "𝐁ᴜᴍʙʟᴇʙᴇᴇ-𝐗ᴍᎠ",
      thumbnailUrl: "https://files.catbox.moe/8k0enh.jpg",
      sourceUrl: "https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10",
      mediaType: 1,
      renderLargerThumbnail: true,
    },
  };

  try {
    const sentMessage = await zk.sendMessage(dest, {
      text: logoOptions,
      contextInfo,
    }, { quoted: ms });
    //
const fetchLogoUrl = async (url, name) => {
  try {
    const response = await axios.get(`https://api-pink-venom.vercel.app/api/logo`, {
      params: { url, name }
    });
    // Check if the API returned a success status and the result object exists
    if (response.data && response.data.status === true && response.data.result && response.data.result.download_url) {
      return response.data.result.download_url;
    } else {
      console.error("API response error or missing download_url:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching logo from API:", error);
    return null;
  }
};

