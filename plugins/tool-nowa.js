let handler = async (m, { conn, text, usedPrefix, command }) => {
  let regex = /x/g
  
  // Check if text input is provided
  if (!text) throw 'Missing number pattern'
  
  // Check if the pattern contains 'x' placeholders
  if (!text.match(regex)) throw `Example: ${usedPrefix + command} 39333333333x`
  
  let random = text.match(regex).length, // Count number of 'x' placeholders
      total = Math.pow(10, random),       // Calculate total combinations (10^x)
      array = []                          // Array to store results
  
  // Generate all possible number combinations
  for (let i = 0; i < total; i++) {
    // Convert number to string with leading zeros
    let list = [...i.toString().padStart(random, '0')]
    
    // Replace 'x' with digits and add WhatsApp format
    let result = text.replace(regex, () => list.shift()) + '@s.whatsapp.net'
    
    // Check if the number is registered on WhatsApp
    if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
      // Get user status/bio information
      let info = await conn.fetchStatus(result).catch(_ => {})
      array.push({ exists: true, jid: result, ...info })
    } else {
      array.push({ exists: false, jid: result })
    }
  }
  
  // Format the response message
  let txt = 'Registered Numbers\n\n' + 
    array.filter(v => v.exists)
         .map(v => `• Number: wa.me/${v.jid.split('@')[0]}\n*• Bio:* ${v.status || 'No description'}\n*• Date:* ${formatDate(v.setAt)}`)
         .join('\n\n') + 
    '\n\n*Not Registered*\n\n' + 
    array.filter(v => !v.exists)
         .map(v => v.jid.split('@')[0])
         .join('\n')
  
  m.reply(txt)
}

// Command configuration
handler.command = /^nowa$/i  // Command: 'nowa' (Number On WhatsApp)

export default handler

// Helper function to format dates
function formatDate(n, locale = 'en') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, { timeZone: 'UTC' })
               }
