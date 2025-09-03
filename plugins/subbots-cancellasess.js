import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fs} from "fs"
import path, { join } from 'path'

// Define an asynchronous handler function
let handler  = async (m, { conn: parentw, usedPrefix, command }, args) => {

    // Determine the user ID (JID)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender

    // Generate a unique ID based on the user
    let uniqid = `${who.split`@`[0]}`

    // Get the user's display name
    let userS = `${conn.getName(who)}`

    try {
        // Remove the directory associated with this user (delete session)
        await fs.rmdir(".//" + uniqid, { recursive: true, force: true })

        // Send a message indicating the session was deleted
        await parentw.sendMessage(m.chat, { text: 'The varesub-Bot session has been deleted.' }, { quoted: fkontak })
    } catch(err) {
        // Handle error if the directory does not exist
        if (err.code === 'ENOENT' && err.path === `./varebot-sub/${uniqid}`) {
            await parentw.sendMessage(m.chat, { text: "🌠 No varebotsub session found." }, { quoted: fkontak })
        } else {
            // React with an error emoji if another error occurs
            await m.react(error)
        }
    }
}

// Assign command pattern for the handler
handler.command = /^(deletesession|eliminarsesion|borrarsesion|delsession|cerrarsesion|delserbot|logout)$/i

// No specific fail handler
handler.fail = null

export default handler
  
