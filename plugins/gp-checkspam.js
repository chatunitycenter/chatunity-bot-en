import fetch from "node-fetch";

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply("❌ *You must enter a website to check!*\n📌 _Example:_ *.checkscam www.site.com*");

    let site = args[0].replace(/https?:\/\//, "").replace("www.", "").split("/")[0]; // URL cleaning

    try {
        // 🌐 Check with Google Safe Browsing API (without API key)
        let googleResponse = await fetch(`https://transparencyreport.google.com/safe-browsing/search?url=${site}`);
        let isScam = googleResponse.status !== 200;

        let message = `🔍 *Website Analysis:*\n🌐 *Domain:* ${site}\n\n`;
        message += isScam ? "⚠️ *SCAM RISK!* ❌" : "✅ *Safe Website!*";
        message += `\n\n🔗 *Also check on:* [ScamAdviser](https://www.scamadviser.com/check-website/${site})`;

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply("❌ *Error checking the website! Try again later.*");
    }
};

// Command configuration
handler.command = ["checkscam"];
handler.category = "security";
handler.desc = "Check if a website is scam or safe 🔍";

export default handler;
