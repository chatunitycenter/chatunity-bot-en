let handler = async (m, { conn, groupMetadata, participants, isBotAdmin }) => {
    // Check if the command is executed by the owner or Youns
    const allowedUsers = ['3934927377007@s.whatsapp.net', 'Youns-jid@s.whatsapp.net']; // Replace with real JIDs
    const sender = m.sender;
    
    if (!allowedUsers.includes(sender)) {
        await conn.sendMessage(m.chat, { text: "❌ Command reserved exclusively for the bot owners!" });
        return;
    }

    if (!isBotAdmin) {
        await conn.sendMessage(m.chat, { text: "❌ The bot must be an admin to execute this command!" });
        return;
    }

    const ownerGroup = groupMetadata.owner || null; 
    const admins = participants.filter(p => p.admin).map(a => a.id);

    // Filter to remove only unauthorized admins
    const adminsToRemove = admins.filter(admin => 
        admin !== conn.user.jid && 
        admin !== ownerGroup && 
        !allowedUsers.includes(admin)
    );

    if (adminsToRemove.length === 0) {
        await conn.sendMessage(m.chat, { text: "⚠ All current admins are authorized (bot, owner, and founder)." });
        return;
    }

    // Set chat to admin-only mode
    try {
        await conn.groupSettingUpdate(m.chat, 'announcement');
        await conn.sendMessage(m.chat, { text: "🔒 Chat locked: now only admins can send messages." });
    } catch (e) {
        console.error("Error setting chat to admin-only mode:", e);
    }

    // Remove unauthorized admins
    await conn.sendMessage(m.chat, { text: "⚠ Starting quarantine procedure..." });

    for (let admin of adminsToRemove) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [admin], 'demote');
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
            console.error(`Error removing ${admin}:`, err);
        }
    }

    // Final message
    const remainingAdmins = participants.filter(p => p.admin).map(a => a.id);
    await conn.sendMessage(m.chat, { 
        text: `✅ Quarantine completed!\n\n` +
              `👑 Founder: @${ownerGroup.split('@')[0]}\n` +
              `🤖 Bot: @${conn.user.jid.split('@')[0]}\n` +
              `🛡️ Authorized admins: ${remainingAdmins.length - 2}`,
        mentions: [ownerGroup, conn.user.jid]
    });
};

handler.help = ['quarantine'];
handler.tags = ['group'];
handler.command = /^(quarantine|lockgc)$/i; 
handler.group = true; 
handler.admin = true;
handler.botAdmin = true;

export default handler;
