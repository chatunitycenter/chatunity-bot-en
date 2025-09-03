const handler = async (m, {
    conn, text,
  }) => {
    if (!m.isGroup) {
      throw '';
    }
    const groups = global.db.data.chats[m.chat];
    if (groups.spacobot === false) {
      throw '';
    }
    const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
    if (!mention) throw 'Who do you want to threaten?';

    const message = `@${mention.split`@`[0]} ${pickRandom(['I will end you', 'I will make you regret this', 'You will pay for that', 'I will teach you a lesson', 'You are in big trouble now', 'I will make you wish you never did that', 'This is your final warning', 'You have crossed the line', 'I will show you no mercy', 'Your time is up', 'I will make an example out of you', 'You have chosen the wrong person to mess with', 'I will make sure you never forget this', 'This is the end for you', 'You are finished'])}`;
    const messageOptions = {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `ChatUnity`
            },
        }
    };

    // Send message with mentions and options
    m.reply(message, null, { mentions: [mention], ...messageOptions });
  };

handler.command = /^threat$/i; // Modified to accept only `.threat` command
export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
