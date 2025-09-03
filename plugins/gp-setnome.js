const lenguajeEN = {
    smsNam2: () => "⚠️ Please enter the new group name",
    smsNam1: () => "✅ Group name changed successfully!",
    smsNam3: () => "✅ Group name changed successfully!",
    smsConMenu: () => "🔙 Back to Menu"
}

let handler = async (m, { conn, args, text }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './menu/chatunitybot.mp4'

    if (!text) return conn.reply(m.chat, lenguajeEN.smsNam2(), fkontak, m)

    try {
        let newName = args.join` `
        if (args && args[0]) {
            await conn.groupUpdateSubject(m.chat, newName)
        }

        await conn.reply(m.chat, lenguajeEN.smsNam1(), fkontak, m)
        // Alternative with button:
        // await conn.sendButton(
        //   m.chat,
        //   'Name changed',
        //   lenguajeEN.smsNam1(),
        //   pp,
        //   [[lenguajeEN.smsConMenu(), '/menu']],
        //   fkontak,
        //   m
        // )

    } catch (e) {
        console.error('Error in setname command:', e)
        throw lenguajeEN.smsNam3()
    }
}

handler.command = /^(setname|setnome|newname)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler