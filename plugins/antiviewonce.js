import { downloadContentFromMessage } from "@whiskeysockets/baileys"

export async function before(m, { isAdmin, isBotAdmin }) {
    let chat = db.data.chats[m.chat]
    if (!chat.antiver || chat.isBanned) return

    // Check if the message is a View Once message
    if (m.mtype == 'viewOnceMessageV2' || m.mtype.hasOwnProperty("viewOnce")) {
        let msg = m.message.viewOnceMessageV2.message
        let type = Object.keys(msg)[0]
        let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')

        let buffer = Buffer.from([])
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (/video/.test(type)) {
            // Send back the video with caption + anti-view-once message
            return this.sendFile(
                m.chat,
                buffer,
                'error.mp4',
                `${msg[type].caption}` + lenguajeGB.smsAntiView1(),
                m
            )
        } else if (/image/.test(type)) {
            // Send back the image with caption + anti-view-once message
            return this.sendFile(
                m.chat,
                buffer,
                'error.jpg',
                `${msg[type].caption}` + lenguajeGB.smsAntiView2(),
                m
            )
        }
    }
}

// Utility function to format file sizes into human-readable strings
function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'TY', 'EY']
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i]
}
