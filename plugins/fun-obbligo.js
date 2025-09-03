let handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, { 
        text: `*┌────「 ‼TRUTH OR DARE‼ 」─*\n*"${pickRandom(global.dare)}"*\n*└────「 © ChatUnity 」─*`,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m });
};

handler.help = ['dare'];
handler.tags = ['fun'];
handler.command = /^dare/i;
export default handler;

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}

global.dare = [
    "Create a fake OnlyFans account with your cousin's photos and share the link in class/work group",
    "Text a random contact 'Sorry about last night, hope you didn't catch anything' and block them immediately",
    "Send a voice message to a friend faking epic orgasms (like 'OH FUCK YES, RICE YES!') and say 'sorry, pocket dial'",
    "Post an Instagram story saying 'Looking for sugar daddy/mommy, crypto accepted' and tag a relative",
    "Go to a store and ask seriously: 'Do you have Nutella-flavored condoms? For a friend.'",
    "Pretend to be a ghost and send whispered audio messages to your ex with phrases like 'WHY DID YOU ABANDON ME...'",
    "Write in the family group 'Guys, I booked a butt tattoo, need a witness'",
    "Order a pizza with 'HELP I'M BEING HELD HOSTAGE BY DOMINOS' written on it and film the delivery",
    "Make a TikTok video dancing in underwear with grandpa white socks and hashtag #SexyGrandpa",
    "Send to all your contacts 'I came in your sandwich. Sorry. Won't do it again.' then 'Test message, ignore'",
    "Go to a pharmacy and ask 'Do you have anything for dick addiction syndrome?'",



In inglese
