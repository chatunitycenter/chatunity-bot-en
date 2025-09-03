// Initialize activeGame as an empty array
let activeGame = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
  conn.math = conn.math || {}
  
  if (!args[0]) {
      throw `
🧮 *Available difficulty levels:* 
${Object.keys(modes).map(v => `▢ ${v}`).join('\n')}

📌 Example: ${usedPrefix + command} normal
`.trim()
  }

  let mode = args[0].toLowerCase()
  if (!(mode in modes)) {
      throw `
🧮 *Available difficulty levels:* 
${Object.keys(modes).map(v => `▢ ${v}`).join('\n')}

📌 Example: ${usedPrefix + command} normal
`.trim()
  }
  
  let id = m.chat // Use chat ID as unique identifier

  // Check if there's an active game
  if (activeGame.length > 0) {
      let remainingTime = ((activeGame[1].time - (Date.now() - activeGame[2])) / 1000)
      return conn.reply(m.chat, 
          `⚠️ There's already an active question in this chat!\n\n` +
          `Question: *${activeGame[1].str}*\n` +
          `Time remaining: ${remainingTime.toFixed(1)} seconds`, 
          activeGame[0])
  }

  let math = genMath(mode)
  let startTime = Date.now()
  
  // Store active game
  activeGame = [
    await conn.reply(m.chat, 
        `▢ *HOW MUCH IS* ${math.str}?\n\n` +
        `⏳ Time: ${(math.time / 1000).toFixed(0)} seconds\n` +
        `💰 Reward: ${math.bonus} XP`, 
        m),
    math,
    startTime,
    setTimeout(() => {
        if (activeGame.length > 0) {
            conn.reply(m.chat, 
                `⏰ Time's up!\n` +
                `The answer was: *${math.result}*`, 
                activeGame[0])
            activeGame = [] // Clear active game
        }
    }, math.time)
  ]
  
  // Answer verification handler
  let answerHandler = async ({ messages }) => {
      let msg = messages[0]
      if (!msg.message || activeGame.length === 0 || msg.key.remoteJid !== id) return
      
      let text = msg.message.conversation || ''
      if (text === math.result.toString()) {
          let timeTaken = (Date.now() - startTime) / 1000
          let score = Math.max(1, Math.floor(math.bonus * (1 - timeTaken / (math.time / 1000))))
          
          await conn.reply(m.chat, 
              `✅ *CORRECT ANSWER!*\n\n` +
              `Time taken: ${timeTaken.toFixed(2)} seconds\n` +
              `Score: ${score} XP`, 
              msg)
          
          clearTimeout(activeGame[3])
          activeGame = [] // Clear active game
          conn.ev.off('messages.upsert', answerHandler)
      } else if (/^\d+$/.test(text)) {
          await conn.reply(m.chat, `❌ Wrong answer! Try again`, msg)
      }
  }
  
  conn.ev.on('messages.upsert', answerHandler)
}

handler.help = ['math <level>']
handler.tags = ['game']
handler.command = ['math', 'calculate', 'calc'] 

let modes = {
  beginner: [-3, 3, -3, 3, '+-', 15000, 100],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 400],
  normal: [-40, 40, -20, 20, '*/+-', 40000, 700],
  hard: [-100, 100, -70, 70, '*/+-', 30000, 800],
  extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 4500]
}

let operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷'
}

function genMath(mode) {
  let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
  let a = randomInt(a1, a2)
  let b = randomInt(b1, b2)
  let op = pickRandom([...ops])
  
  // Avoid division by zero
  if (op === '/' && b === 0) b = 1
  
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
  if (op == '/') [a, result] = [result, a]
  
  // Round division results
  if (op === '/') result = Math.round(result * 100) / 100
  
  return {
      str: `${a} ${operators[op]} ${b}`,
      mode,
      time,
      bonus,
      result
  }
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from]
  from = Math.floor(from)
  to = Math.floor(to)
  return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

handler.modes = modes

export default handler
