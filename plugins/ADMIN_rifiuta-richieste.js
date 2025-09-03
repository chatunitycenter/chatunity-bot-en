// ADMIN_reject-requests.js

// Reject +## by Youns
let handler = async (m, { conn, isAdmin, isBotAdmin, args }) => {
  if (!m.isGroup) return m.reply("This command can only be used in groups.")
  if (!isBotAdmin) return m.reply("I need to be an admin to reject requests.")
  if (!isAdmin) return m.reply("Only group admins can use this command.")

  try {
    const groupId = m.chat
    const pending = await conn.groupRequestParticipantsList(groupId)
    const prefixFilter = args[0]

    if (!pending.length) return m.reply("There are no requests to reject.")

    let rejected = 0

    for (let p of pending) {
      const number = p.jid.split('@')[0]

      if (!prefixFilter || number.startsWith(prefixFilter)) {
        try {
          await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'reject')
          rejected++
        } catch (e) {
          console.log(`[ERROR] Failed to reject ${p.jid}:`, e)
        }
      }
    }

    if (rejected === 0) {
      return m.reply(prefixFilter ? `No requests with prefix +${prefixFilter}.` : "No requests were rejected.")
    }

    m.reply(`❌ Successfully rejected ${rejected} request(s)${prefixFilter ? ` with prefix +${prefixFilter}` : ""}.`)

  } catch (err) {
    console.error('[REJECT ERROR]', err)
    m.reply("Error while rejecting requests.")
  }
}

handler.command = ['rejectrequests']
handler.tags = ['group']
handler.help = ['reject [prefix] - rejects requests (e.g. .reject 39)']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
