let handler = async (m, { conn, text, participants }) => {
  try {
    // Delay function
    const delay = (time) => new Promise((res) => setTimeout(res, time));

    // Extract the message content from the command
    let customMessage = text.trim(); // Take all text after the command

    if (!customMessage) {
      // If there's no message, return an error
      return m.reply("Please write a message together with the command!");
    }

    // Get group users (for hidetag)
    let users = participants.map((u) => conn.decodeJid(u.id));

    // Function to send a message with "hidetag"
    const sendHidetagMessage = async (message) => {
      let more = String.fromCharCode(0); // Invisible character
      let masss = more.repeat(0); // Repeat the character to form invisible space
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${masss}\n${message}\n`,
          contextInfo: { mentionedJid: users }, // Mention all users
        },
      }, {});
    };

    const maxMessageLength = 200;
    let messageChunks = [];

    // Split message into chunks if too long
    while (customMessage.length > maxMessageLength) {
      messageChunks.push(customMessage.slice(0, maxMessageLength));
      customMessage = customMessage.slice(maxMessageLength);
    }
    messageChunks.push(customMessage); // Add the remaining part

    // Send the "flood" messages with delay and hidetag
    for (let i = 0; i < 10; i++) {
      for (let chunk of messageChunks) {
        await sendHidetagMessage(chunk); // Send message with hidetag
        await delay(2000); // 2-second delay between messages
      }
    }
  } catch (e) {
    console.error(e);
  }
};

handler.command = /^(bigtag)$/i; // Trigger command ".bigtag"
handler.group = true; // Works only in group chats
handler.rowner = true; // Only the bot owner can use it

export default handler;
