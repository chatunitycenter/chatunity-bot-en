let handler = async (m, { conn, usedPrefix, command, args: [event], text }) => {
    if (!event) return await m.reply(
`ⓘ Command usage:\n\n> ${usedPrefix + command} welcome @user\n> ${usedPrefix + command} goodbye @user\n> ${usedPrefix + command} promote/p @user\n> ${usedPrefix + command} demote/r @user`) 

    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    let act = false
    let eventText = ''

    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
        case 'bienvenida':
        case 'benvenuto':       
            act = 'add'
            eventText = "welcome"
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
        case 'sacar':
        case 'addio':
            act = 'remove'
            eventText = "goodbye"
            break
        case 'promote':
        case 'daradmin':
        case 'darpoder':
        case 'promozione':
        case 'p':       
            act = 'promote'
            eventText = "promotion"
            break
        case 'demote':
        case 'quitaradmin':
        case 'quitarpoder':
        case 'retrocessione':
        case 'r':       
            act = 'demote'
            eventText = "demotion"
            break
        default:
            throw `ⓘ Enter a valid option:\n\n> ${usedPrefix + command} welcome @user\n> ${usedPrefix + command} goodbye @user\n> ${usedPrefix + command} promote/p @user\n> ${usedPrefix + command} demote/r @user`
    }

    m.reply(`> ⚠️ Simulating ${eventText}...\n> ⓘ The bot is simulating an event without making real changes in the group.`)

    if (act) return conn.participantsUpdate({
        id: m.chat,
        participants: part,
        action: act
    })
}

handler.help = ['simulate <event> [@mention]','sim <event>']
handler.tags = ['owner']
handler.command = /^sim|simula$/i
handler.group = true
export default handler