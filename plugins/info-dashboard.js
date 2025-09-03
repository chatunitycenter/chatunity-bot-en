let handler = async (m, { conn }) => {
    let stats = Object.entries(db.data.stats).map(([key, val]) => {
        let name = Array.isArray(plugins[key]?.help) ? plugins[key]?.help?.join(' , ') : plugins[key]?.help || key 
        
        if (/exec/.test(name)) return
        return { name, ...val }
    })
     
    stats = stats.sort((a, b) => b.total - a.total)
    
    let txt = stats.slice(0, 10).map(({ name, total, last }) => {
        return `┏━━━━━━━━━━━━━┓
┣📚 COMMAND : ${name}
┣🗂️ USES : ${total}
┣⏱️ LAST USED : ${getTime(last)}
┗━━━━━━━━━━━━━┛`
    }).join('\n\n')
    
    await conn.reply(m.chat, `⚡ *TOP 10 MOST USED COMMANDS* ⚡\n\n${txt}`, m)
}

handler.help = ['dashboard']
handler.tags = ['info']
handler.command = /^dashboard$/i

export default handler

function parseMs(ms) {
    if (typeof ms !== 'number') throw 'Invalid parameter'
    return {
        days: Math.floor(ms / 86400000),
        hours: Math.floor(ms / 3600000) % 24,
        minutes: Math.floor(ms / 60000) % 60,
        seconds: Math.floor(ms / 1000) % 60
    }
}

function getTime(ms) {
    if (!ms) return 'Never used'
    let now = parseMs(+new Date() - ms)
    if (now.days) return `${now.days} days ago`
    if (now.hours) return `${now.hours} hours ago`
    if (now.minutes) return `${now.minutes} minutes ago`
    return `a few seconds ago`
}