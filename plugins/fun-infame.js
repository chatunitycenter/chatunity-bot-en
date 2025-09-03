const handler = async (msg, { client, conn }) => {
    const percent = Math.floor(Math.random() * 101);
    
    if (!conn?.sendMessage) throw new Error("Bro, missing connection 😒");

    // Social media style reactions (no cringe) 🔥
    const savageReactions = [
        `🧢 *"Nah, you're clean"* (but under ${percent}% you're kinda sus...)`,  
        `👀 *"Bro, are you the black sheep of the chat?"*`,  
        `💀 *"You're the reason grandmas hide their wallets"*`,  
        `🤡 *"If infamy was a TikTok, you'd be viral"*`,  
        `🚓 *"Local police? More like DICTATORIAL with this level"*`,  
        `🤑 *"If you stole like you're infamous, you'd be Jeff Bezos"*`,  
        `📸 *"You're the screenshot that shouldn't have been taken"*`,  
        `🔥 *"You got more skeletons in the closet than followers"*`
    ];
    
    const randomSavage = savageReactions[Math.floor(Math.random() * savageReactions.length)];
    
    let response = `📊 *INFAMY TEST* 📊\n\n` +
                  `👤 *Your infamy level:* **${percent}%**\n` +
                  `${percent > 80 ? "🚨 *YOU'RE THE SNITCH ADMIN!* 🚨" : percent > 50 ? "😎 *You're in the danger zone...*" : "🧼 *Clean... maybe.*"}\n\n` +
                  `${randomSavage}`;

    await conn.sendMessage(
        msg.chat, 
        { 
            text: response,
            mentions: [msg.sender],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "⚠️ You've been EXPOSED ⚠️",
                    body: "Official results (and non-appealable)",
                    thumbnail: Buffer.alloc(0) // You can add an image here
                }
            }
        }, 
        { quoted: msg }
    );
};

handler.command = ['infamy', 'snitchcheck', 'expose'];
handler.tags = ['social'];
handler.help = ['infamy @user', 'snitchcheck (discover your infamy level)'];
export default handler;
