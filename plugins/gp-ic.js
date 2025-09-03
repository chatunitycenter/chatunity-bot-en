//creator command by sam github.com/realvare
import axios from 'axios'
import fs from 'fs'
import path from 'path'

function normalize(str) {
    if (!str) return '';
    str = str.split(/\s*[\(\[{](?:feat|ft|featuring).*$/i)[0]
        .split(/\s*(?:feat|ft|featuring)\.?\s+.*$/i)[0]
    
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}
async function getRandomItalianTrackFromItunes(artist) {
    const keywords = [
       "Lazza", "Melons", "Sayf", "Sfera Ebbasta", "Ghali","Baby Gang", "Shiva", "Drake", "Tony Boy", "Kid Yugi", "21 savage", "Marracash", "Capo Plaza", "Guè Pequeno", "Melons", "King Von", "Chief Keef", "Lil Durk",  "Tha Supreme", "Gemitaiz", "Fabri Fibra", "Marracash", "Simba La Rue", "Il tre", "Rondo Da Sosa", "Drefgold", "Noyz Narcos", "Salmo", "Clementino", "Noyz Narcos", "Rocco Hunt", "Luchè",
    ]
    let found = null
    let attempts = 0
    while (!found && attempts < 5) {
        const randomKeyword = artist ? artist : keywords[Math.floor(Math.random() * keywords.length)]
        const response = await axios.get('https://itunes.apple.com/search', {
            params: {
                term: randomKeyword,
                country: 'IT',
                media: 'music',
                limit: 20
            }
        })
        const valid = response.data.results.filter(b => b.previewUrl && b.trackName && b.artistName)
        if (valid.length) found = valid[Math.floor(Math.random() * valid.length)]
        attempts++
    }
    if (!found) throw new Error(`${global.error}`)
    return {
        title: found.trackName,
        artist: found.artistName,
        preview: found.previewUrl
    }
}

const activeGames = new Map()
const pendingArtistChoice = new Map()

let handler = async (m, { conn, args }) => {
    const chat = m.chat

    // If user still needs to respond with artist name
    if (pendingArtistChoice.has(chat) && !m.text.startsWith('.ic')) {
        const artist = m.text.trim()
        pendingArtistChoice.delete(chat)
        return startGame(m, conn, chat, artist)
    }

    // If there's already an active game
    if (activeGames.has(chat)) {
        return m.reply('『 ⚠️ 』- \`There is already a game in progress in this group!\` ')
    }

    // First level: mode selection
    if (!args[0]) {
        await conn.sendMessage(m.chat, {
            text: "Do you want to play with a specific artist or in general?",
            footer: "Choose a mode:",
            buttons: [
                { buttonId: '.ic generale', buttonText: { displayText: "🎲 General" }, type: 1 },
                { buttonId: '.ic specifico', buttonText: { displayText: "🎤 Specific" }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m })
        return
    }

    // Second level: choice between random or specific artist
    if (args[0] === 'specifico' && !args[1]) {
        await conn.sendMessage(m.chat, {
            text: "Do you want a random artist or do you want to choose one?",
            footer: "Choose a mode:",
            buttons: [
                { buttonId: '.ic specifico casuale', buttonText: { displayText: "🎲 Random among famous" }, type: 1 },
                { buttonId: '.ic specifico scegli', buttonText: { displayText: "📝 Choose artist" }, type: 1 }
            ],
            headerType: 1
        }, { quoted: m })
        return
    }

    // If choosing random among famous
    if (args[0] === 'specifico' && args[1] === 'casuale') {
        return startGame(m, conn, chat)
    }

    // If choosing to enter an artist
    if (args[0] === 'specifico' && args[1] === 'scegli') {
        pendingArtistChoice.set(chat, true)
        await conn.sendMessage(m.chat, {
            text: "Now write the name of the artist you want to play with.",
            footer: "Example: Sfera Ebbasta",
            headerType: 1
        }, { quoted: m })
        return
    }

    // If choosing general mode
    if (args[0] === 'generale') {
        return startGame(m, conn, chat)
    }
}

async function startGame(m, conn, chat, artist = null) {
    try {
        const track = await getRandomItalianTrackFromItunes(artist)
        const audioResponse = await axios.get(track.preview, {
            responseType: 'arraybuffer'
        })
        const tmpDir = path.join(process.cwd(), 'tmp')
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true })
        }
        const audioPath = path.join(tmpDir, `song_${Date.now()}.mp3`)
        fs.writeFileSync(audioPath, Buffer.from(audioResponse.data))
        await conn.sendMessage(m.chat, { 
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: m })
        fs.unlinkSync(audioPath)
        const formatGameMessage = (timeLeft) => `
 ⋆｡˚『 ╭ \`GUESS THE SONG\` ╯ 』˚｡⋆\n╭\n│
┃ 『 ⏱️ 』 \`Time:\` *${timeLeft} seconds* 
┃ 『 👤 』 \`Artist:\` *${track.artist}* 
┃
┃ \`Write the song title!\`
┃ \`vare ✧ bot\`
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
        let gameMessage = await conn.reply(m.chat, formatGameMessage(30), m)
        let game = {
            track,
            timeLeft: 30,
            message: gameMessage,
            interval: null
        }
        game.interval = setInterval(async () => {
            try {
                game.timeLeft -= 5
            
                if (game.timeLeft <= 0) {
                    clearInterval(game.interval)
                    activeGames.delete(chat)
                    await conn.sendMessage(m.chat, {
                        delete: gameMessage.key
                    }).catch(() => {})
                    await conn.sendMessage(m.chat, {
                        text: `
ㅤㅤ⋆｡˚『 ╭ \`TIME\'S UP\` ╯ 』˚｡⋆\n╭\n│
│ ➤ \`No one guessed it!\`
┃ 『  』🎵 \`Title:\` *${track.title}*
┃ 『  』👤 \`Artist:\` *${track.artist}*
┃
╰⭒─ׄ─ׅ─ׄ─⭒`,
                        buttons: [
                            {
                                buttonId: '.ic',
                                buttonText: {
                                    displayText: '『 🎵 』 Play Again'
                                },
                                type: 1
                            }
                        ],
                        headerType: 1
                    }).catch(() => {})
                    return
                }
                if (activeGames.has(chat)) {
                    await conn.sendMessage(m.chat, {
                        text: formatGameMessage(game.timeLeft),
                        edit: gameMessage.key
                    }).catch(() => {}) // I'll die a legend when the time comes!!!!
                }
            } catch (e) {
                console.error('Error in countdown:', e)
            }
        }, 5000) //timer every 5 seconds because of ratelimit czz
        activeGames.set(chat, game)

    } catch (e) {
        console.error('Error in guess the song:', e)
        m.reply(`${global.error}`)
        activeGames.delete(chat)
    }
}
handler.before = async (m, { conn }) => {
    const chat = m.chat
    
    if (!activeGames.has(chat)) return
    
    const game = activeGames.get(chat)
    const userAnswer = normalize(m.text || '')
    const correctAnswer = normalize(game.track.title)
    if (!userAnswer || userAnswer.length < 2) return;
    function similarity(str1, str2) {
        const words1 = str1.split(' ').filter(Boolean)
        const words2 = str2.split(' ').filter(Boolean)
        
        const matches = words1.filter(word => 
            words2.some(w2 => w2.includes(word) || word.includes(w2))
        )
        return matches.length / Math.max(words1.length, words2.length)
    }

    const similarityScore = similarity(userAnswer, correctAnswer)
    const isCorrect = 
        (userAnswer.length > 1) &&
        (
            userAnswer === correctAnswer ||
            (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length * 0.5) ||
            (userAnswer.includes(correctAnswer) && userAnswer.length < correctAnswer.length * 1.5) ||
            similarityScore >= 0.7
        );

    if (isCorrect) {
        clearInterval(game.interval)
        activeGames.delete(chat)
        let reward = Math.floor(Math.random() * 100) + 50
        let exp = 500
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
        global.db.data.users[m.sender].limit = (global.db.data.users[m.sender].limit || 0) + reward
        global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + exp
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        }).catch(() => {})
        await conn.sendMessage(m.chat, {
            delete: game.message.key
        }).catch(() => {})
        await conn.sendMessage(m.chat, {
            text: `
ㅤㅤ⋆｡˚『 ╭ \`CORRECT\` ╯ 』˚｡⋆\n╭\n│
│ ➤ \`Correct Answer!\`
┃ 『  』🎵 \`Title:\` *${game.track.title}*
┃ 『  』👤 \`Artist:\` *${game.track.artist}*
┃
┃ 『 🎁 』 \`Winnings:\`
│ ➤  \`${reward}\` *UnityCoins*
│ ➤  \`${exp}\` *exp*
┃
┃ 💰 *Current balance:* ${global.db.data.users[m.sender].limit} UnityCoins
╰⭒─ׄ─ׅ─ׄ─⭒`,
            buttons: [
                {
                    buttonId: '.ic',
                    buttonText: {
                        displayText: '『 🎵 』 Play Again'
                    },
                    type: 1
                }
            ],
            headerType: 1
        }, { quoted: m }).catch(() => {})
        
        console.log('Debug answer:', {
            userAnswer,
            correctAnswer,
            similarity: similarity(userAnswer, correctAnswer)
        })
    } else if (similarityScore >= 0.3) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '❌', //only for similar names
                key: m.key
            }
        }).catch(() => {})
        await conn.reply(m.chat, '👀 *You\'re close!* Try again...', m)
    }
}

handler.help = ['indovinacanzone']
handler.tags = ['games']
handler.command = ['guessong', 'gs']
handler.register = true

export default handler
