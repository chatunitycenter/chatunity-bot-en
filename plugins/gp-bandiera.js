let handler = async (m, { conn, args, participants, isAdmin, isBotAdmin }) => {
  if (m.text?.toLowerCase() === '.skipflag') {
    if (!m.isGroup) return m.reply('⚠️ This command only works in groups!')
    if (!global.flagGame?.[m.chat]) return m.reply('⚠️ There is no active game in this group!')
    
    if (!isAdmin && !m.fromMe) {
      return m.reply('❌ *This command can only be used by admins!*')
    }

    clearTimeout(global.flagGame[m.chat].timeout)
    await conn.reply(m.chat, `🛑 *Flag game stopped by admin*\n✨ The answer was: *${global.flagGame[m.chat].answer}*`, m)
    delete global.flagGame[m.chat]
    return
  }

  if (global.flagGame?.[m.chat]) {
    return m.reply('⚠️ There is already an active game in this group!')
  }

  const cooldownKey = `flag_${m.chat}`
  const lastGame = global.cooldowns?.[cooldownKey] || 0
  const now = Date.now()
  const cooldownTime = 10000

  if (now - lastGame < cooldownTime) {
    const remainingTime = Math.ceil((cooldownTime - (now - lastGame)) / 1000)
    return m.reply(`⏳ *Wait ${remainingTime} more seconds before starting a new game!*`)
  }

  global.cooldowns = global.cooldowns || {}
  global.cooldowns[cooldownKey] = now

  let flags = [
    { url: 'https://flagcdn.com/w320/it.png', name: 'Italy' },
    { url: 'https://flagcdn.com/w320/fr.png', name: 'France' },
    { url: 'https://flagcdn.com/w320/de.png', name: 'Germany' },
    { url: 'https://flagcdn.com/w320/gb.png', name: 'United Kingdom' },
    { url: 'https://flagcdn.com/w320/es.png', name: 'Spain' },
    { url: 'https://flagcdn.com/w320/se.png', name: 'Sweden' },
    { url: 'https://flagcdn.com/w320/no.png', name: 'Norway' },
    { url: 'https://flagcdn.com/w320/fi.png', name: 'Finland' },
    { url: 'https://flagcdn.com/w320/dk.png', name: 'Denmark' },
    { url: 'https://flagcdn.com/w320/pl.png', name: 'Poland' },
    { url: 'https://flagcdn.com/w320/pt.png', name: 'Portugal' },
    { url: 'https://flagcdn.com/w320/gr.png', name: 'Greece' },
    { url: 'https://flagcdn.com/w320/ch.png', name: 'Switzerland' },
    { url: 'https://flagcdn.com/w320/at.png', name: 'Austria' },
    { url: 'https://flagcdn.com/w320/be.png', name: 'Belgium' },
    { url: 'https://flagcdn.com/w320/nl.png', name: 'Netherlands' },
    { url: 'https://flagcdn.com/w320/ua.png', name: 'Ukraine' },
    { url: 'https://flagcdn.com/w320/ro.png', name: 'Romania' },
    { url: 'https://flagcdn.com/w320/hu.png', name: 'Hungary' },
    { url: 'https://flagcdn.com/w320/cz.png', name: 'Czech Republic' },
    { url: 'https://flagcdn.com/w320/ie.png', name: 'Ireland' },
    { url: 'https://flagcdn.com/w320/ee.png', name: 'Estonia' },
    { url: 'https://flagcdn.com/w320/lt.png', name: 'Lithuania' },
    { url: 'https://flagcdn.com/w320/lv.png', name: 'Latvia' },
    { url: 'https://flagcdn.com/w320/sk.png', name: 'Slovakia' },
    { url: 'https://flagcdn.com/w320/si.png', name: 'Slovenia' },
    { url: 'https://flagcdn.com/w320/hr.png', name: 'Croatia' },
    { url: 'https://flagcdn.com/w320/ba.png', name: 'Bosnia and Herzegovina' },
    { url: 'https://flagcdn.com/w320/me.png', name: 'Montenegro' },
    { url: 'https://flagcdn.com/w320/mk.png', name: 'North Macedonia' },
    { url: 'https://flagcdn.com/w320/al.png', name: 'Albania' },
    { url: 'https://flagcdn.com/w320/bg.png', name: 'Bulgaria' },
    { url: 'https://flagcdn.com/w320/md.png', name: 'Moldova' },
    { url: 'https://flagcdn.com/w320/by.png', name: 'Belarus' },
    { url: 'https://flagcdn.com/w320/is.png', name: 'Iceland' },
    { url: 'https://flagcdn.com/w320/mt.png', name: 'Malta' },
    { url: 'https://flagcdn.com/w320/cy.png', name: 'Cyprus' },
    { url: 'https://flagcdn.com/w320/lu.png', name: 'Luxembourg' },
    { url: 'https://flagcdn.com/w320/li.png', name: 'Liechtenstein' },
    { url: 'https://flagcdn.com/w320/sm.png', name: 'San Marino' },
    { url: 'https://flagcdn.com/w320/ad.png', name: 'Andorra' },
    { url: 'https://flagcdn.com/w320/mc.png', name: 'Monaco' },
    { url: 'https://flagcdn.com/w320/va.png', name: 'Vatican City' },
    { url: 'https://flagcdn.com/w320/rs.png', name: 'Serbia' },
    { url: 'https://flagcdn.com/w320/xk.png', name: 'Kosovo' },
    { url: 'https://flagcdn.com/w320/cn.png', name: 'China' },
    { url: 'https://flagcdn.com/w320/jp.png', name: 'Japan' },
    { url: 'https://flagcdn.com/w320/in.png', name: 'India' },
    { url: 'https://flagcdn.com/w320/kr.png', name: 'South Korea' },
    { url: 'https://flagcdn.com/w320/kp.png', name: 'North Korea' },
    { url: 'https://flagcdn.com/w320/th.png', name: 'Thailand' },
    { url: 'https://flagcdn.com/w320/vn.png', name: 'Vietnam' },
    { url: 'https://flagcdn.com/w320/id.png', name: 'Indonesia' },
    { url: 'https://flagcdn.com/w320/ph.png', name: 'Philippines' },
    { url: 'https://flagcdn.com/w320/my.png', name: 'Malaysia' },
    { url: 'https://flagcdn.com/w320/sg.png', name: 'Singapore' },
    { url: 'https://flagcdn.com/w320/mm.png', name: 'Myanmar' },
    { url: 'https://flagcdn.com/w320/kh.png', name: 'Cambodia' },
    { url: 'https://flagcdn.com/w320/la.png', name: 'Laos' },
    { url: 'https://flagcdn.com/w320/lk.png', name: 'Sri Lanka' },
    { url: 'https://flagcdn.com/w320/np.png', name: 'Nepal' },
    { url: 'https://flagcdn.com/w320/bt.png', name: 'Bhutan' },
    { url: 'https://flagcdn.com/w320/bd.png', name: 'Bangladesh' },
    { url: 'https://flagcdn.com/w320/pk.png', name: 'Pakistan' },
    { url: 'https://flagcdn.com/w320/af.png', name: 'Afghanistan' },
    { url: 'https://flagcdn.com/w320/ir.png', name: 'Iran' },
    { url: 'https://flagcdn.com/w320/iq.png', name: 'Iraq' },
    { url: 'https://flagcdn.com/w320/tr.png', name: 'Turkey' },
    { url: 'https://flagcdn.com/w320/il.png', name: 'Israel' },
    { url: 'https://flagcdn.com/w320/ps.png', name: 'Palestine' },
    { url: 'https://flagcdn.com/w320/sa.png', name: 'Saudi Arabia' },
    { url: 'https://flagcdn.com/w320/ae.png', name: 'United Arab Emirates' },
    { url: 'https://flagcdn.com/w320/qa.png', name: 'Qatar' },
    { url: 'https://flagcdn.com/w320/om.png', name: 'Oman' },
    { url: 'https://flagcdn.com/w320/jo.png', name: 'Jordan' },
    { url: 'https://flagcdn.com/w320/lb.png', name: 'Lebanon' },
    { url: 'https://flagcdn.com/w320/sy.png', name: 'Syria' },
    { url: 'https://flagcdn.com/w320/ye.png', name: 'Yemen' },
    { url: 'https://flagcdn.com/w320/kz.png', name: 'Kazakhstan' },
    { url: 'https://flagcdn.com/w320/uz.png', name: 'Uzbekistan' },
    { url: 'https://flagcdn.com/w320/tj.png', name: 'Tajikistan' },
    { url: 'https://flagcdn.com/w320/kg.png', name: 'Kyrgyzstan' },
    { url: 'https://flagcdn.com/w320/tm.png', name: 'Turkmenistan' },
    { url: 'https://flagcdn.com/w320/mn.png', name: 'Mongolia' },
    { url: 'https://flagcdn.com/w320/az.png', name: 'Azerbaijan' },
    { url: 'https://flagcdn.com/w320/ge.png', name: 'Georgia' },
    { url: 'https://flagcdn.com/w320/am.png', name: 'Armenia' },
    { url: 'https://flagcdn.com/w320/kw.png', name: 'Kuwait' },
    { url: 'https://flagcdn.com/w320/bh.png', name: 'Bahrain' },
    { url: 'https://flagcdn.com/w320/tw.png', name: 'Taiwan' },
    { url: 'https://flagcdn.com/w320/hk.png', name: 'Hong Kong' },
    { url: 'https://flagcdn.com/w320/eg.png', name: 'Egypt' },
    { url: 'https://flagcdn.com/w320/ng.png', name: 'Nigeria' },
    { url: 'https://flagcdn.com/w320/ma.png', name: 'Morocco' },
    { url: 'https://flagcdn.com/w320/tn.png', name: 'Tunisia' },
    { url: 'https://flagcdn.com/w320/ke.png', name: 'Kenya' },
    { url: 'https://flagcdn.com/w320/et.png', name: 'Ethiopia' },
    { url: 'https://flagcdn.com/w320/gh.png', name: 'Ghana' },
    { url: 'https://flagcdn.com/w320/cm.png', name: 'Cameroon' },
    { url: 'https://flagcdn.com/w320/ci.png', name: "Ivory Coast" },
    { url: 'https://flagcdn.com/w320/sn.png', name: 'Senegal' },
    { url: 'https://flagcdn.com/w320/zm.png', name: 'Zambia' },
    { url: 'https://flagcdn.com/w320/zw.png', name: 'Zimbabwe' },
    { url: 'https://flagcdn.com/w320/ao.png', name: 'Angola' },
    { url: 'https://flagcdn.com/w320/mg.png', name: 'Madagascar' },
    { url: 'https://flagcdn.com/w320/tz.png', name: 'Tanzania' },
    { url: 'https://flagcdn.com/w320/ug.png', name: 'Uganda' },
    { url: 'https://flagcdn.com/w320/mz.png', name: 'Mozambique' },
    { url: 'https://flagcdn.com/w320/rw.png', name: 'Rwanda' },
    { url: 'https://flagcdn.com/w320/mw.png', name: 'Malawi' },
    { url: 'https://flagcdn.com/w320/bw.png', name: 'Botswana' },
    { url: 'https://flagcdn.com/w320/na.png', name: 'Namibia' },
    { url: 'https://flagcdn.com/w320/sz.png', name: 'Eswatini' },
    { url: 'https://flagcdn.com/w320/ls.png', name: 'Lesotho' },
    { url: 'https://flagcdn.com/w320/dz.png', name: 'Algeria' },
    { url: 'https://flagcdn.com/w320/ly.png', name: 'Libya' },
    { url: 'https://flagcdn.com/w320/sd.png', name: 'Sudan' },
    { url: 'https://flagcdn.com/w320/ss.png', name: 'South Sudan' },
    { url: 'https://flagcdn.com/w320/er.png', name: 'Eritrea' },
    { url: 'https://flagcdn.com/w320/dj.png', name: 'Djibouti' },
    { url: 'https://flagcdn.com/w320/so.png', name: 'Somalia' },
    { url: 'https://flagcdn.com/w320/cd.png', name: 'Democratic Republic of the Congo' },
    { url: 'https://flagcdn.com/w320/cg.png', name: 'Republic of the Congo' },
    { url: 'https://flagcdn.com/w320/cf.png', name: 'Central African Republic' },
    { url: 'https://flagcdn.com/w320/td.png', name: 'Chad' },
    { url: 'https://flagcdn.com/w320/ne.png', name: 'Niger' },
    { url: 'https://flagcdn.com/w320/ml.png', name: 'Mali' },
    { url: 'https://flagcdn.com/w320/bf.png', name: 'Burkina Faso' },
    { url: 'https://flagcdn.com/w320/mr.png', name: 'Mauritania' },
    { url: 'https://flagcdn.com/w320/gn.png', name: 'Guinea' },
    { url: 'https://flagcdn.com/w320/gw.png', name: 'Guinea-Bissau' },
    { url: 'https://flagcdn.com/w320/sl.png', name: 'Sierra Leone' },
    { url: 'https://flagcdn.com/w320/lr.png', name: 'Liberia' },
    { url: 'https://flagcdn.com/w320/tg.png', name: 'Togo' },
    { url: 'https://flagcdn.com/w320/bj.png', name: 'Benin' },
    { url: 'https://flagcdn.com/w320/ga.png', name: 'Gabon' },
    { url: 'https://flagcdn.com/w320/gq.png', name: 'Equatorial Guinea' },
    { url: 'https://flagcdn.com/w320/cv.png', name: 'Cape Verde' },
    { url: 'https://flagcdn.com/w320/gm.png', name: 'Gambia' },
    { url: 'https://flagcdn.com/w320/bi.png', name: 'Burundi' },
    { url: 'https://flagcdn.com/w320/km.png', name: 'Comoros' },
    { url: 'https://flagcdn.com/w320/mu.png', name: 'Mauritius' },
    { url: 'https://flagcdn.com/w320/sc.png', name: 'Seychelles' },
    { url: 'https://flagcdn.com/w320/us.png', name: 'United States' },
    { url: 'https://flagcdn.com/w320/ca.png', name: 'Canada' },
    { url: 'https://flagcdn.com/w320/mx.png', name: 'Mexico' },
    { url: 'https://flagcdn.com/w320/br.png', name: 'Brazil' },
    { url: 'https://flagcdn.com/w320/ar.png', name: 'Argentina' },
    { url: 'https://flagcdn.com/w320/cl.png', name: 'Chile' },
    { url: 'https://flagcdn.com/w320/co.png', name: 'Colombia' },
    { url: 'https://flagcdn.com/w320/pe.png', name: 'Peru' },
    { url: 'https://flagcdn.com/w320/ve.png', name: 'Venezuela' },
    { url: 'https://flagcdn.com/w320/cu.png', name: 'Cuba' },
    { url: 'https://flagcdn.com/w320/bo.png', name: 'Bolivia' },
    { url: 'https://flagcdn.com/w320/ec.png', name: 'Ecuador' },
    { url: 'https://flagcdn.com/w320/uy.png', name: 'Uruguay' },
    { url: 'https://flagcdn.com/w320/py.png', name: 'Paraguay' },
    { url: 'https://flagcdn.com/w320/cr.png', name: 'Costa Rica' },
    { url: 'https://flagcdn.com/w320/pa.png', name: 'Panama' },
    { url: 'https://flagcdn.com/w320/do.png', name: 'Dominican Republic' },
    { url: 'https://flagcdn.com/w320/jm.png', name: 'Jamaica' },
    { url: 'https://flagcdn.com/w320/gt.png', name: 'Guatemala' },
    { url: 'https://flagcdn.com/w320/hn.png', name: 'Honduras' },
    { url: 'https://flagcdn.com/w320/ni.png', name: 'Nicaragua' },
    { url: 'https://flagcdn.com/w320/sv.png', name: 'El Salvador' },
    { url: 'https://flagcdn.com/w320/bz.png', name: 'Belize' },
    { url: 'https://flagcdn.com/w320/ht.png', name: 'Haiti' },
    { url: 'https://flagcdn.com/w320/gy.png', name: 'Guyana' },
    { url: 'https://flagcdn.com/w320/sr.png', name: 'Suriname' },
    { url: 'https://flagcdn.com/w320/gf.png', name: 'French Guiana' },
    { url: 'https://flagcdn.com/w320/tt.png', name: 'Trinidad and Tobago' },
    { url: 'https://flagcdn.com/w320/bb.png', name: 'Barbados' },
    { url: 'https://flagcdn.com/w320/lc.png', name: 'Saint Lucia' },
    { url: 'https://flagcdn.com/w320/dm.png', name: 'Dominica' },
    { url: 'https://flagcdn.com/w320/bs.png', name: 'Bahamas' },
    { url: 'https://flagcdn.com/w320/au.png', name: 'Australia' },
    { url: 'https://flagcdn.com/w320/nz.png', name: 'New Zealand' },
    { url: 'https://flagcdn.com/w320/fj.png', name: 'Fiji' },
    { url: 'https://flagcdn.com/w320/pg.png', name: 'Papua New Guinea' },
    { url: 'https://flagcdn.com/w320/nc.png', name: 'New Caledonia' },
    { url: 'https://flagcdn.com/w320/pr.png', name: 'Puerto Rico' },
    { url: 'https://flagcdn.com/w320/gl.png', name: 'Greenland' },
    { url: 'https://flagcdn.com/w320/gi.png', name: 'Gibraltar' },
    { url: 'https://flagcdn.com/w320/aq.png', name: 'Antarctica' },
    { url: 'https://flagcdn.com/w320/eh.png', name: 'Western Sahara' },
  ]

  let phrases = [
    `🇺🇳 *GUESS THE FLAG!* 🇺🇳`,
    `🌍 *Which country does this flag represent?*`,
    `🏳️ *Geographic challenge: recognize this flag?*`,
    `🧭 *Guess the country from its flag!*`,
    `🎯 *Flag quiz: which country is this?*`,
    `🌟 *Test your geographic knowledge!*`,
    `🔍 *Look carefully and guess the country!*`,
  ]

  let choice = flags[Math.floor(Math.random() * flags.length)]
  let phrase = phrases[Math.floor(Math.random() * phrases.length)]

  try {
    let msg = await conn.sendMessage(m.chat, {
      image: { url: choice.url },
      caption: `${phrase}\n\n ㌌ *Reply with the country name!*\n⏱️ *Available time:* 30 seconds\n\n> \`vare ✧ bot\``,
      quoted: m
    })

    global.flagGame = global.flagGame || {}
    global.flagGame[m.chat] = {
      id: msg.key.id,
      answer: choice.name.toLowerCase(),
      originalAnswer: choice.name,
      attempts: {},
      suggested: false,
      startTime: Date.now(),
      timeout: setTimeout(() => {
        if (global.flagGame?.[m.chat]) {
          conn.reply(m.chat, `⏳ *Time's up!*\n\n🌍 *The answer was:* *${choice.name}*\n\n> \`vare ✧ bot\``, msg)
          delete global.flagGame[m.chat]
        }
      }, 30000)
    }
  } catch (error) {
    console.error('Error in flag game:', error)
    m.reply('❌ *An error occurred while starting the game*\n\n🔄 *Try again in a few seconds*')
  }
}

function normalizeString(str) {
    if (!str) return ''
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
}

function calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ').filter(word => word.length > 1)
    const words2 = str2.split(' ').filter(word => word.length > 1)
    
    if (words1.length === 0 || words2.length === 0) return 0
    
    const matches = words1.filter(word => 
        words2.some(w2 => w2.includes(word) || word.includes(w2))
    )
    
    return matches.length / Math.max(words1.length, words2.length)
}

function isAnswerCorrect(userAnswer, correctAnswer) {
    if (userAnswer.length < 2) return false
    
    const similarityScore = calculateSimilarity(userAnswer, correctAnswer)
    
    return (
        userAnswer === correctAnswer ||
        (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length * 0.5) ||
        (userAnswer.includes(correctAnswer) && userAnswer.length < correctAnswer.length * 1.5) ||
        similarityScore >= 0.8
    )
}

handler.before = async (m, { conn }) => {
    const chat = m.chat
    const game = global.flagGame?.[chat]
    
    if (!game || !m.quoted || m.quoted.id !== game.id || m.key.fromMe) return
    
    const userAnswer = normalizeString(m.text || '')
    const correctAnswer = normalizeString(game.answer)
    
    if (!userAnswer || userAnswer.length < 2) return
    
    const similarityScore = calculateSimilarity(userAnswer, correctAnswer)

    if (isAnswerCorrect(userAnswer, correctAnswer)) {
        clearTimeout(game.timeout)
        
        const timeTaken = Math.round((Date.now() - game.startTime) / 1000)
        let reward = Math.floor(Math.random() * 31) + 20
        let exp = 500
        
        const timeBonus = timeTaken <= 10 ? 20 : timeTaken <= 20 ? 10 : 0
        reward += timeBonus
        
        // Initialize wallet if it doesn't exist
        if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
        if (global.db.data.users[m.sender].limit == null) global.db.data.users[m.sender].limit = 0
        if (global.db.data.users[m.sender].exp == null) global.db.data.users[m.sender].exp = 0

        // Add UnityCoins and exp (use .limit as wallet balance)
        global.db.data.users[m.sender].limit = Number(global.db.data.users[m.sender].limit) + Number(reward)
        global.db.data.users[m.sender].exp = Number(global.db.data.users[m.sender].exp) + Number(exp)

        // Force database write and update memory cache
        if (global.db && typeof global.db.write === 'function') {
            await global.db.write();
            await global.db.read(); // update cache after writing
        }

        let congratsMessage = `
╭━『 🎉 *CORRECT ANSWER!* 』━╮
┃
┃ 🌍 *Country:* ${game.originalAnswer}
┃ ⏱️ *Time taken:* ${timeTaken}s
┃
┃ 🎁 *Rewards:*
┃ • ${reward} 🪙 UnityCoins${timeBonus > 0 ? ` (+${timeBonus} speed bonus)` : ''}
┃ • ${exp} 🆙 EXP
┃
┃ 💰 *Current balance:* ${global.db.data.users[m.sender].limit} UnityCoins
╰━━━━━━━━━━━━━━━━╯

> \`vare ✧ bot\``

        await conn.reply(chat, congratsMessage, m)
        delete global.flagGame[chat]
        
    } else if (similarityScore >= 0.6 && !game.suggested) {
        game.suggested = true
        await conn.reply(chat, '👀 *You are close!*', m)
        
    } else if (game.attempts[m.sender] >= 3) {
        await conn.reply(chat, '❌ *You have exhausted your 3 attempts!*\n\n⏳ *Wait for other players to try or for time to run out*', m)
        
    } else {
        game.attempts[m.sender] = (game.attempts[m.sender] || 0) + 1
        const attemptsLeft = 3 - game.attempts[m.sender]
        
        if (attemptsLeft === 1) {
            const firstLetter = game.originalAnswer[0].toUpperCase()
            const letterCount = game.originalAnswer.length
            await conn.reply(chat, `❌ *Wrong answer!*

💡 *Hint:*
   • Starts with the letter *"${firstLetter}"*
   • Composed of *${letterCount} letters*`, m)
        } else if (attemptsLeft === 2) {
            await conn.reply(chat, `❌ *Wrong answer!*

📝 *Attempts left:* 
🤔 *Think carefully about your next answer!*`, m)
        } else {
            await conn.reply(chat, `❌ *Wrong answer!*

📝 *Last attempt remaining..*`, m)
        }
    }
}

handler.help = ['flag']
handler.tags = ['games']
handler.command = /^(flag|skipflag)$/i
handler.group = true
handler.register = true

export default handler
