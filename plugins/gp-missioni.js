import fs from 'fs';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    const botName = global.db.data.nomedelbot || 'ChatUnity Bot';
    const image = fs.existsSync('./chatunity.png') ? fs.readFileSync('./chatunity.png') : null;

    if (!global.db.data) global.db.data = {};
    if (!global.db.data.users) global.db.data.users = {};

    const who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;

    let user = global.db.data.users[who] || {
        money: 0,
        bank: 0,
        warn: 0,
        messaggi: 0,
        command: 0,
        totalMessaggi: 0,
        lastWarn: 0,
        lastCommand: 0,
        missions: {
            daily: { completed: 0, lastReset: Date.now(), current: [] },
            weekly: { completed: 0, lastReset: Date.now(), current: [] }
        }
    };

    if (!user.missions) {
        user.missions = {
            daily: { completed: 0, lastReset: Date.now(), current: [] },
            weekly: { completed: 0, lastReset: Date.now(), current: [] }
        };
    }

    const now = Date.now();
    const dailyResetNeeded = !user.missions.daily.current.length || 
        now - user.missions.daily.lastReset >= 86400000;
    const weeklyResetNeeded = !user.missions.weekly.current.length || 
        now - user.missions.weekly.lastReset >= 604800000;

    if (dailyResetNeeded) {
        user.missions.daily = {
            completed: 0,
            lastReset: now,
            current: generateDailyMissions()
        };
    }

    if (weeklyResetNeeded) {
        user.missions.weekly = {
            completed: 0,
            lastReset: now,
            current: generateWeeklyMissions()
        };
    }

    global.db.data.users[who] = user;

    if (!args[0]) {
        return showMainMenu(m, conn, usedPrefix, botName, image, who);
    }

    switch (args[0].toLowerCase()) {
        case 'daily':
        case 'giornaliere':
            return showDailyMissions(m, conn, user, botName, image, usedPrefix, who);
        case 'weekly':
        case 'settimanali':
            return showWeeklyMissions(m, conn, user, botName, image, usedPrefix, who);
        case 'claim':
        case 'riscuoti':
            return claimRewards(m, conn, user, botName, image, usedPrefix, who);
        default:
            return showMainMenu(m, conn, usedPrefix, botName, image, who);
    }
};

/* ========= UI FUNCTIONS ========= */
async function showMainMenu(m, conn, usedPrefix, botName, image, who) {
    const user = global.db.data.users[who];
    const dailyCompleted = user.missions.daily.current.filter(m => m.completed).length;
    const weeklyCompleted = user.missions.weekly.current.filter(m => m.completed).length;

    const buttons = [
        { buttonId: `${usedPrefix}missioni daily`, buttonText: { displayText: '📅 DAILY' }, type: 1 },
        { buttonId: `${usedPrefix}missioni weekly`, buttonText: { displayText: '📆 WEEKLY' }, type: 1 },
        { buttonId: `${usedPrefix}missioni claim`, buttonText: { displayText: '💰 CLAIM' }, type: 1 }
    ];

    return conn.sendMessage(m.chat, {
        text: `🎯 *${botName.toUpperCase()} MISSION SYSTEM*\n\n` +
              `👤 User: @${who.split('@')[0]}\n` +
              `💰 Wallet: ${user.money} UC\n` +
              `🏦 Bank: ${user.bank} UC\n` +
              `📅 Daily: ${dailyCompleted}/${user.missions.daily.current.length} completed\n` +
              `📆 Weekly: ${weeklyCompleted}/${user.missions.weekly.current.length} completed\n\n` +
              `Select a mission type:`,
        footer: 'Complete missions to earn UnityCoins!',
        buttons: buttons,
        mentions: [who],
        headerType: 1,
        jpegThumbnail: image
    }, { quoted: m });
}

async function showDailyMissions(m, conn, user, botName, image, usedPrefix, who) {
    let text = `📅 *DAILY MISSIONS* @${who.split('@')[0]}\n\n`;
    const resetTime = 86400000 - (Date.now() - user.missions.daily.lastReset);
    text += `⏳ Reset in: ${formatTime(resetTime)}\n\n`;

    user.missions.daily.current.forEach((mission, i) => {
        const progress = getProgress(user, mission.type);
        const isReady = progress >= mission.target && !mission.completed;
        text += `▢ *${i+1}. ${mission.title}*\n`;
        text += `➠ Progress: ${progress}/${mission.target}\n`;
        text += `➠ Reward: ${mission.reward} UC\n`;
        text += `➠ Status: ${mission.completed ? '✅ CLAIMED' : isReady ? '💰 READY' : '❌ IN PROGRESS'}\n\n`;
    });

    const buttons = [
        { buttonId: `${usedPrefix}missioni claim`, buttonText: { displayText: '💰 CLAIM' }, type: 1 },
        { buttonId: `${usedPrefix}missioni weekly`, buttonText: { displayText: '📆 WEEKLY' }, type: 1 },
        { buttonId: `${usedPrefix}missioni`, buttonText: { displayText: '🔙 BACK' }, type: 1 }
    ];

    return conn.sendMessage(m.chat, {
        text: text,
        footer: `Use "${usedPrefix}missioni claim" to claim your rewards!`,
        buttons: buttons,
        mentions: [who],
        headerType: 1,
        jpegThumbnail: image
    }, { quoted: m });
}

async function showWeeklyMissions(m, conn, user, botName, image, usedPrefix, who) {
    let text = `📆 *WEEKLY MISSIONS* @${who.split('@')[0]}\n\n`;
    const resetTime = 604800000 - (Date.now() - user.missions.weekly.lastReset);
    text += `⏳ Reset in: ${formatTime(resetTime)}\n\n`;

    user.missions.weekly.current.forEach((mission, i) => {
        const progress = getProgress(user, mission.type);
        const isReady = progress >= mission.target && !mission.completed;
        text += `▢ *${i+1}. ${mission.title}*\n`;
        text += `➠ Progress: ${progress}/${mission.target}\n`;
        text += `➠ Reward: ${mission.reward} UC\n`;
        text += `➠ Status: ${mission.completed ? '✅ CLAIMED' : isReady ? '💰 READY' : '❌ IN PROGRESS'}\n\n`;
    });

    const buttons = [
        { buttonId: `${usedPrefix}missioni claim`, buttonText: { displayText: '💰 CLAIM' }, type: 1 },
        { buttonId: `${usedPrefix}missioni daily`, buttonText: { displayText: '📅 DAILY' }, type: 1 },
        { buttonId: `${usedPrefix}missioni`, buttonText: { displayText: '🔙 BACK' }, type: 1 }
    ];

    return conn.sendMessage(m.chat, {
        text: text,
        footer: `Weekly missions - Bigger rewards!`,
        buttons: buttons,
        mentions: [who],
        headerType: 1,
        jpegThumbnail: image
    }, { quoted: m });
}

/* ========= GENERATORS ========= */
function generateDailyMissions() {
    return [
        { title: "Send 50 messages", type: "messaggi", target: 50, reward: 500, completed: false },
        { title: "Execute 10 commands", type: "command", target: 10, reward: 300, completed: false },
        { title: "Stay without warnings", type: "no_warn", target: 1, reward: 700, completed: false }
    ];
}

function generateWeeklyMissions() {
    return [
        { title: "Send 300 messages", type: "messaggi", target: 300, reward: 2500, completed: false },
        { title: "Execute 50 commands", type: "command", target: 50, reward: 1500, completed: false },
        { title: "Stay 7 days without warnings", type: "no_warn_week", target: 1, reward: 3500, completed: false },
        { title: "Reach 1000 total messages", type: "total_messaggi", target: 1000, reward: 5000, completed: false }
    ];
}

function getProgress(user, type) {
    switch(type) {
        case 'messaggi': return user.messaggi || 0;
        case 'command': return
            case 'command': return user.command || 0;
        case 'no_warn': return user.warn > 0 ? 0 : 1;
        case 'no_warn_week':
            const weekAgo = Date.now() - 604800000;
            return (user.warn > 0 || (user.lastWarn && user.lastWarn > weekAgo)) ? 0 : 1;
        case 'total_messaggi': return user.totalMessaggi || user.messaggi || 0;
        default: return 0;
    }
}

            async function claimRewards(m, conn, user, botName, image, usedPrefix, who) {
    let total = 0;
    let claimed = 0;
    let details = [];

    // Check daily missions
    for (const mission of user.missions.daily.current) {
        const progress = getProgress(user, mission.type);
        if (progress >= mission.target && !mission.completed) {
            total += mission.reward;
            claimed++;
            mission.completed = true;
            user.missions.daily.completed++;
            details.push(`✅ ${mission.title}: +${mission.reward} UC`);
        }
    }

    // Check weekly missions
    for (const mission of user.missions.weekly.current) {
        const progress = getProgress(user, mission.type);
        if (progress >= mission.target && !mission.completed) {
            total += mission.reward;
            claimed++;
            mission.completed = true;
            user.missions.weekly.completed++;
            details.push(`✅ ${mission.title}: +${mission.reward} UC`);
        }
    }

    if (claimed === 0) {
        return conn.reply(m.chat, `@${who.split('@')[0]}, you have no completed missions to claim!`, m, { mentions: [who] });
    }

    // Add total reward to user's balance
    user.money = (user.money || 0) + total;
    global.db.data.users[who] = user;

    const buttons = [
        { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 WALLET' }, type: 1 },
        { buttonId: `${usedPrefix}missioni`, buttonText: { displayText: '🎯 MISSIONS' }, type: 1 }
    ];

    await conn.sendMessage(m.chat, {
        text: `🎉 @${who.split('@')[0]} you have claimed *${total} UnityCoins*!\n\n` +
              `${details.join('\n')}\n\n` +
              `💰 New Wallet: *${user.money} UC*\n` +
              `🏦 Bank: *${user.bank} UC*`,
        footer: 'Use .wallet to see your full balance',
        buttons: buttons,
        mentions: [who],
        headerType: 1,
        jpegThumbnail: image
    }, { quoted: m });

    // Optional backup to file
    try {
        fs.writeFileSync('./db_users_backup.json', JSON.stringify(global.db.data.users, null, 2));
    } catch (e) {
        console.error('Backup error:', e);
    }
            }
function formatTime(ms) {
    if (ms <= 0) return '00:00:00';

    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:` +
           `${minutes.toString().padStart(2, '0')}:` +
           `${secs.toString().padStart(2, '0')}`;
}
handler.help = ['missioni'];
handler.tags = ['rpg'];
handler.command = ['missioni', 'missions', 'daily', 'weekly'];
handler.register = true;

export default handler;
