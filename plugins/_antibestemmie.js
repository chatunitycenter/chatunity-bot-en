let handler = async (m, { conn, isAdmin, isBotAdmin, usedPrefix, command }) => {
    // Command management to enable/disable the feature
    if (command === 'antibestemmia') {
        if (!m.isGroup) return m.reply('This command only works in groups!');
        if (!isAdmin) return m.reply('Only admins can use this command!');
        
        global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
        global.db.data.chats[m.chat].antibestemmie = !global.db.data.chats[m.chat].antibestemmie;
        
        return m.reply(`Anti-blasphemy filter ${global.db.data.chats[m.chat].antibestemmie ? 'enabled' : 'disabled'}!`);
    }

    // Main detection function
    if (
        !m.isGroup ||
        !global.db.data.chats?.[m.chat]?.antibestemmie ||
        isAdmin ||
        !isBotAdmin ||
        typeof m.text !== 'string'
    ) return;

    try {
        // Local cache to avoid too many API requests
        const cacheKey = `bestemmia:${m.sender}:${m.text.toLowerCase().trim()}`;
        if (global.cache && global.cache[cacheKey]) return;
        
        // Quick check with local regex before calling the API
        const quickCheck = /(d[i1!][o0]|porc|madonn|crist|ges[uù])/i.test(m.text);
        if (!quickCheck) return;
        
        // Call to external API
        const apiUrl = `https://deliriusapi-official.vercel.app/ia/gptweb?text=${encodeURIComponent(m.text)}&lang=it`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        const isBestemmia = data.result && data.result.includes("bestemmia");
        
        // Save in cache
        if (global.cache) global.cache[cacheKey] = isBestemmia;
        if (!isBestemmia) return;

        // User management and warning
        if (!global.db.data.users) global.db.data.users = {};
        if (!global.db.data.users[m.sender]) {
            global.db.data.users[m.sender] = { warn: 0, lastWarn: 0 };
        }

        const user = global.db.data.users[m.sender];
        const now = Date.now();
        
        // Reset warn after 24 hours
        if (now - user.lastWarn > 86400000) user.warn = 0;
        
        user.warn += 1;
        user.lastWarn = now;

        // Delete the message
        await conn.sendMessage(m.chat, { delete: m.key }).catch(console.error);

        // Actions based on warnings
        if (user.warn >= 3) {
            user.warn = 0;
            try {
                await conn
