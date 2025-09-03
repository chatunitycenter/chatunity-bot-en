import ws from 'ws'

let handler = async (m, { conn }) => {
  // Initialize a Map to store unique users
  let uniqueUsers = new Map()

  // Ensure global.conns is an array
  if (!global.conns || !Array.isArray(global.conns)) {
    global.conns = []
  }

  // Loop through all connections
  global.conns.forEach((conn) => {
    // Check if the connection has a user and the WebSocket is open
    if (conn.user && conn.ws?.socket?.readyState !== ws.CLOSED) {
      // Add the user to the Map to ensure uniqueness
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  // Count total unique users
  let totalUsers = uniqueUsers.size

  // Prepare the message text
  let txt = '*`🍭 Subbots active:`*' + ` » *${totalUsers || 0}*`

  // Send reply in the chat
  await conn.reply(m.chat, txt, m, rcanal)
}

handler.command = ['bots']
export default handler
