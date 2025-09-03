import MessageType from '@whiskeysockets/baileys'

let feeRate = 0.02 // 2% fee on transactions

let handler = async (m, { conn, text }) => {
    let recipient
    if (m.isGroup) recipient = m.mentionedJid[0] // If in group, get mentioned user
    else recipient = m.chat // If in private chat, use current user
    
    if (!recipient) throw '🚩 You must mention the recipient @user'
    
    let txt = text.replace('@' + recipient.split`@`[0], '').trim()
    if (!txt) throw '🚩 Enter the amount of 💶 Unicycles to transfer'
    if (isNaN(txt)) throw 'Are you joking? Please write only numbers'
    
    let amount = parseInt(txt)
    let totalCost = amount
    let feeAmount = Math.ceil(amount * feeRate)
    totalCost += feeAmount
    
    if (totalCost < 1) throw '🚩 Minimum transfer amount is 1 Unicycle'
    let users = global.db.data.users
    if (totalCost > users[m.sender].limit) throw "You don't have enough 💶 Unicycles to complete this transfer"
    
    // Execute transaction
    users[m.sender].limit -= totalCost
    users[recipient].limit += amount
    
    await m.reply(`*${-amount}* 💶 Unicycles transferred!
Fee 2%: *${-feeAmount}* 💶
Total debited: *${-totalCost}* 💶`)
    
    // Notify recipient
    conn.fakeReply(m.chat, `*+${amount}* 💶 Unicycles received!`, recipient, m.text)
}
