// Code for editfile.js

import fs from 'fs';

let handler = async (message, { text, usedPrefix, command }) => {
  if (!text) throw 'Please provide the file path to edit';
  if (!message.quoted || !message.quoted.text) throw 'Reply to the message containing the new file content';
  
  let filePath = text;
  
  // Check if file exists
  if (!fs.existsSync(filePath)) throw 'File does not exist';
  
  // Overwrite file content
  fs.writeFileSync(filePath, message.quoted.text);

  let responseMessage = {
    key: {
      participants: '0@s.whatsapp.net',
      fromMe: false,
      id: 'EditFile'
    },
    message: {
      locationMessage: {
        name: 'File Edited',
        jpegThumbnail: await (await fetch('https://telegra.ph/file/876cc3f192ec040e33aba.png')).buffer(),
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;File;;;\nFN:File\nEND:VCARD'
      }
    },
    participant: '0@s.whatsapp.net'
  };
  
  conn.reply(message.chat, `File "${text}" has been successfully edited`, responseMessage);
};

handler.tags = ['owner'];
handler.command = /^editfile$/i;
handler.rowner = true;

export default handler;
