let cooldowns = {};

// Definition of rcanal (replace "default_value" with the appropriate value)
const rcanal = "default_value"; 

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users[m.sender];
  let waitTime = 10; // in seconds

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < waitTime * 1000) {
    let timeLeft = secondsToHMS(Math.ceil((cooldowns[m.sender] + waitTime * 1000 - Date.now()) / 1000));
    await conn.sendMessage(m.chat, { 
        text: `🚩 You already placed a bet recently. Please wait *⏱ ${timeLeft}* before betting again.`,
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
    return;
  }

  cooldowns[m.sender] = Date.now();

  if (!text) {
    await conn.sendMessage(m.chat, { 
        text: `🚩 You must enter an amount of *💶 Unitycoins* and bet on a color, for example: *${usedPrefix + command} 20 black or red*`,
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
    return;
  }

  let args = text.trim().split(" ");
  if (args.length !== 2) {
    await conn.sendMessage(m.chat, { 
        text: `🚩 Invalid format. You must enter an amount of *💶 Unitycoins* and bet on a color, for example: *${usedPrefix + command} 20 black*`,
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
    return;
  }

  let amount = parseInt(args[0]);
  let color = args[1].toLowerCase();

  if (isNaN(amount) || amount <= 0) {
    await conn.sendMessage(m.chat, { 
        text: `🚩 Please enter a valid amount to bet.`,
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
    return;
  }

  if (amount > 50) {
    await conn.sendMessage(m.chat, { 
        text: "🚩 The maximum bet amount is 50 *💶 Unitycoins*.",
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
    return;
  }

  if (!(color === 'black' || color === 'red')) {
    await conn.sendMessage(m.chat, { 
        text: "🚩 You must bet on a valid color: *black* or *red*.",
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
    return;
  }

  if (amount > users.limit) {
    await conn.sendMessage(m.chat, { 
        text: "🚩 You don't have enough *💶 Unitycoins* to make this bet.",
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
    return;
  }

  await conn.sendMessage(m.chat, { 
      text: `🚩 You have bet ${amount} *💶 Unitycoins* on the color ${color}. Please wait *⏱ 10 seconds* for the result.`,
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

  setTimeout(() => {
    let result = Math.random();
    let win = false;

    if (result < 0.5) {
      win = color === 'black';
    } else {
      win = color === 'red';
    }
    
    if (win) {
      users.limit += amount;
      conn.sendMessage(m.chat, { 
          text: `🚩 You won! You gained ${amount} *💶 Unitycoins*. Total: ${users.limit} *💶 Unitycoins*.`,
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
    } else {
      users.limit -= amount;
      conn.sendMessage(m.chat, { 
          text: `🚩 You lost. ${amount} *💶 Unitycoins* have been deducted. Total: ${users.limit} *💶 Unitycoins*.`,
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
    }
  }, 10000);
};

handler.tags = ['game'];
handler.help = ['roulette *<amount> <color>*'];
handler.command = ['roulette', 'ruleta', 'rt'];
handler.register = true;
handler.group = true;
export default handler;

function secondsToHMS(seconds) {
  let remaining = seconds % 60;
  return `${remaining} seconds`;
}
