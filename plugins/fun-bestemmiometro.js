import fetch from 'node-fetch'

// Main handler
let handler = m => m

handler.before = async function (m) {
    // Access user and chat data from global database
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]

    // If it's not a group, exit
    if (!m.isGroup) return null

    // If the blasphemy meter function is not active, exit
    if (!chat.bestemmiometro) return

    // Regex to detect English blasphemies/swear words
    const regex = /(?:god damn|goddamn|jesus christ|jesus fucking christ|christ almighty|holy shit|holy fuck|bloody hell|god damn it|god fucking damn it|jesus fucking christ|what the hell|what the fuck|for fuck's sake|motherfucker|shit damn|hell yeah|god awful|jesus wept|christ on a bike|holy mother of god|god forsaken|god damned|bloody fucking hell|fucking hell|damn it to hell|jesus h christ|christ in heaven|god be damned|holy fucking shit|god damn son of a bitch)/i

    // If the message contains blasphemies
    if (regex.test(m.text)) {
        user.blasphemy = (user.blasphemy || 0) + 1
        user.blasphemyCounted = Math.floor(user.blasphemy / 10)

        // Notify only every 10 blasphemies
        if (user.blasphemy % 10 === 0) {
            const mention = '@' + m.sender.split('@')[0] + ` has said ${user.blasphemy} blasphemies!`
            let quoted = {
                key: {
                    participants: '0@s.whatsapp.net',
                    fromMe: false,
                    id: 'Halo'
                },
                message: {
                    locationMessage: {
                        name: '𝐁𝐥𝐚𝐬𝐩𝐡𝐞𝐦𝐲 𝐌𝐞𝐭𝐞𝐫',
                        jpegThumbnail: await (await fetch('https://telegra.ph/file/ba01cc1e5bd64ca9d65ef.jpg')).buffer(),
                        vcard: 'BEGIN:VCARD\x0aVERSION:3.0\x0aN:;Unlimited;;;\x0aFN:Unlimited\x0aORG:Unlimited\x0aTITLE:\x0aitem1.TEL;waid=19709001746:+1\x20(970)\x20900-1746\x0aitem1.X-ABLabel:Unlimited\x0aX-WA-BIZ-DESCRIPTION:ofc\x0aX-WA-BIZ-NAME:Unlimited\x0aEND:VCARD'
                    }
                },
                participant: '0@s.whatsapp.net'
            }
            await conn.sendMessage(m.chat, {
                text: mention,
                mentions: [...mention.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
            }, { quoted })
        }
    }
}

export default handler
