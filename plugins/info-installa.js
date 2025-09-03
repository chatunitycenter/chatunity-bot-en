import os from 'os'
import util from 'util'
import sizeFormatter from 'human-readable'
import MessageType from '@whiskeysockets/baileys'
import fs from 'fs'
const ims = './bb.jpg'
import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime) 
  let totalreg = Object.keys(global.db.data.users).length
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
  const groups = chats.filter(([id]) => id.endsWith('@g.us'))
  const used = process.memoryUsage()
  const { restrict } = global.db.data.settings[conn.user.jid] || {}
  const { autoread } = global.opts
  let old = performance.now()
  let neww = performance.now()
  let speed = (neww - old).toFixed(4)

  let msgKey = { 
    "key": {
      "participants": "0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Hello"
    }, 
    "message": { 
      "orderMessage": { 
        text: 'DOWNLOAD chatunity-bot-en 💬',
        itemCount: 2023,
        status: 1,
        surface: 1,
        message: 'DOWNLOAD chatunity-bot-en 💬',
        "vcard": `BEGIN:VCARD\nVERSION:5.0\nN;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD`
      }
    }, 
    "participant": "0@s.whatsapp.net"
  }

  let info = `
『💬』 ══ •⊰✰⊱• ══ 『💬』

DOWNLOAD chatunity-bot-en

Follow these steps to properly install ChatUnity Bot on Termux

Termux repository: https://github.com/chatunitycenter/chatunity-bot-en

YT tutorial video: https://youtube.com/shorts/qek7wWadhtI?si=MrrA3bLWWAsLmpw6

『💬』 ══ •⊰✰⊱• ══ 『💬』

1. Download and install Termux

Download the correct version of Termux from the link below:

🔗 Download Termux 0.119.1

https://www.mediafire.com/file/0npdmv51pnttps0/com.termux_0.119.1-119_minAPI21(arm64-v8a,armeabi-v7a,x86,x86_64)(nodpi)_apkmirror.com.apk/file

After downloading the APK, install it on your device and grant the requested permissions.

『💬』 ══ •⊰✰⊱• ══ 『💬』

2. Configure Termux

Open Termux and run the following command:

termux-setup-storage

Grant permissions when prompted.

『💬』 ══ •⊰✰⊱• ══ 『💬』

3. Install ChatUnity Bot

Run the following command to update Termux:

apt update -y && yes | apt upgrade && pkg install -y bash wget mpv && wget -O - https://raw.githubusercontent.com/chatunitycenter/chatunity-bot-en/main/chatunity.sh | bash

『💬』 ══ •⊰✰⊱• ══ 『💬』

4. Start ChatUnity Bot

After installation, you can start the bot using the command shown at the end of the process.

If you encounter problems, make sure all steps were followed correctly and check for any error messages in Termux.

『💬』 ══ •⊰✰⊱• ══ 『💬』
`.trim()

  conn.reply(m.chat, info, msgKey, m, {
    contextInfo: { 
      externalAdReply: {
        mediaUrl: null, 
        mediaType: 1, 
        description: null, 
        title: 'BOT INFO',
        body: 'ChatUnity',         
        previewType: 0, 
        thumbnail: fs.readFileSync("./menu/Menu2.jpg"),
        sourceUrl: `https://github.com/chatunitycenter/chatunity-bot-en`
      }
    }
  })
}

handler.help = ['infobot', 'speed']
handler.tags = ['info', 'tools']
handler.command = /^(download|install|git|installbot)$/i
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}