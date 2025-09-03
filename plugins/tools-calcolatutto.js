let handler = async (m, { conn, text }) => {
    let id = m.chat
    conn.math = conn.math ? conn.math : {}
    
    // Clear any existing math session for this chat
    if (id in conn.math) {
      clearTimeout(conn.math[id][3])
      delete conn.math[id]
      m.reply('Previous calculation cleared.')
    }
    
    // Clean and normalize the mathematical expression
    let val = text
      .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')  // Remove invalid characters
      .replace(/×/g, '*')                        // Convert × to *
      .replace(/÷/g, '/')                        // Convert ÷ to /
      .replace(/π|pi/gi, 'Math.PI')             // Convert π/pi to Math.PI
      .replace(/e/gi, 'Math.E')                 // Convert e to Math.E
      .replace(/\/+/g, '/')                     // Remove duplicate division signs
      .replace(/\++/g, '+')                     // Remove duplicate plus signs
      .replace(/-+/g, '-')                      // Remove duplicate minus signs
    
    // Format expression for display (convert back to readable symbols)
    let format = val
      .replace(/Math\.PI/g, 'π')                // Convert Math.PI back to π
      .replace(/Math\.E/g, 'e')                 // Convert Math.E back to e
      .replace(/\//g, '÷')                      // Convert / back to ÷
      .replace(/\*/g, '×')                      // Convert * back to ×
  
    try {
      console.log(val)
      
      // Evaluate the mathematical expression safely
      let result = (new Function('return ' + val))()
      
      if (!result && result !== 0) throw result
      
      // Send formatted result
      m.reply(`📊 *Calculation Result*\n\n` +
              `🔢 *Expression:* ${format}\n` +
              `🧮 *Result:* _${result}_`)
              
    } catch (e) {
      if (e == undefined) {
        m.reply(`❌ *Calculation Error*\n\n` +
                `🔢 *Expression:* ${format}\n` +
                `⚠️ *Error:* Invalid mathematical expression`)
      } else {
        m.reply(`❌ *Calculation Error*\n\n` +
                `🔢 *Expression:* ${format}\n` +
                `⚠️ *Error:* ${e.message || 'Mathematical error occurred'}`)
      }
    }
}

// Command configuration
handler.help = ['calc', 'calculator', 'math']
handler.tags = ['tools']
handler.command = /^(calc|calculator|math)$/i

export default handler
