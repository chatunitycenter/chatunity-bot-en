let buatall = 1;
let cooldowns = {};

const rcanal = "default_value"; // Replace "default_value" with appropriate value

let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
    let user = global.db.data.users[m.sender];
    let randombot = Math.floor(Math.random() * 101);
    let randomyou = Math.floor(Math.random() * 55);
    let Bot = randombot * 1;
    let You = randomyou * 1;
    let count = args[0];
    let who = m.fromMe ? conn.user.jid : m.sender;
    let username = conn.getName(who);

    let waitTime = 15;

    // Show buttons ONLY if no amount has been chosen yet
    if (args.length < 1) {
        // Calculate available denominations based on user's coins
        const maxUC = Math.max(10, Math.floor(user.limit / 2));
        const denominations = [10, 50, 100, 250, 500, 1000].filter(n => n <= maxUC);
        return conn.sendMessage(m.chat, {
            text: `🚩 Enter the amount of 🪙 UnityCoins you want to bet against *chatunity-bot*.\n\nExample:\n> *${usedPrefix + command}* 100`,
            buttons: denominations.map(n => ({
                buttonId: `${usedPrefix + command} ${n}`,
                buttonText: { displayText: `${n} 🪙` },
                type: 1
            }))
        }, { quoted: m });
    }

    // Apply cooldown ONLY after user has chosen a valid amount
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < waitTime * 1000) {
        let timeLeft = secondsToHMS(Math.ceil((cooldowns[m.sender] + waitTime * 1000 - Date.now()) / 1000));
        conn.reply(m.chat, `🚩 You already started a bet recently, wait *⏱ ${timeLeft}* to bet again.`, m, rcanal);
        return;
    }

    cooldowns[m.sender] = Date.now();

    count = count
        ? /all/i.test(count)
            ? Math.floor(global.db.data.users[m.sender].limit / buatall)
            : parseInt(count)
        : args[0]
        ? parseInt(args[0])
        : 1;
    count = Math.max(1, count);

    if (user.limit >= count * 1) {
        user.limit -= count * 1;
        if (Bot > You) {
            conn.reply(
                m.chat,
                `🌵 Let's see your numbers!\n\n➠ *chatunity-bot*: ${Bot}\n➠ *${username}*: ${You}\n\n> ${username}, *YOU LOST* ${formatNumber(count)} 🪙 UnityCoins.`,
                m,
                rcanal
            );
        } else if (Bot < You) {
            user.limit += count * 2;
            conn.reply(
                m.chat,
                `🌵 Let's see your numbers!\n\n➠ *chatunity-bot*: ${Bot}\n➠ *${username}*: ${You}\n\n> ${username}, *YOU WON* ${formatNumber(count * 2)} 🪙 UnityCoins.`,
                m,
                rcanal
            );
        } else {
            user.limit += count * 1;
            conn.reply(
                m.chat,
                `🌵 Let's see your numbers!\n\n➠ *chatunity-bot*: ${Bot}\n➠ *${username}*: ${You}\n\n> ${username}, you get back ${formatNumber(count * 1)} 🪙 UnityCoins.`,
                m,
                rcanal
            );
        }
    } else {
        conn.reply(m.chat, `You don't have *${formatNumber(count)} 🪙 UnityCoins* to bet!`, m, rcanal);
    }
};

handler.help = ['bet <amount>'];
handler.tags = ['game'];
handler.command = /^(bet|casino|gamble)$/i;
handler.register = true;

handler.fail = null;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function secondsToHMS(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    return `${minutes}m ${secondsLeft}s`;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
