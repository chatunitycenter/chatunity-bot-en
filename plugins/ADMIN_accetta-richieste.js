// Code for ADMIN_accept-requests.js :)

let handler = async (m, { conn, isAdmin, isBotAdmin, participants, groupMetadata }) => {
  if (!m.isGroup) return m.reply("This command is only used in groups.")
  if (!isBotAdmin) return m.reply("I need to be admin to accept requests.")
  if (!isAdmin) return m.reply("Only group admins can use this command.")

  try {
    const groupId = m.chat
    const pending = await conn.groupRequestParticipantsList(groupId)

    if (!pending.length) return m.reply("There are no requests to accept.")

    let accepted = 0

    for (let p of pending) {
      try {
        await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve')
        accepted++
      } catch (e) {
        console.log(`[ERROR] Could not accept ${p.jid}:`, e)
      }
    }

    m.reply(`✅ Successfully accepted ${accepted} requests.`)

  } catch (err) {
    console.error('[ACCEPT ERROR]', err)
    m.reply('Error while accepting requests.')
  }
}

handler.command = ['acceptrequests']
handler.tags = ['group']
handler.help = ['accept - accept all pending requests']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
