if (command === 'accept') {
    let trade = tradeRequests[sender]
    if (!trade) return m.reply('❌ No trade request found.')
    
    let senderData = users[trade.from]
    let targetData = users[sender]
    if (!senderData || !targetData) return m.reply('❌ User data not found.')

    let myPokemons = senderData.pokemons || []
    let theirPokemons = targetData.pokemons || []

    if (!myPokemons[trade.myIndex]) return m.reply(`❌ Your Pokémon no. ${trade.myIndex + 1} does not exist.`)
    if (!theirPokemons[trade.theirIndex]) return m.reply(`❌ The other user's Pokémon no. ${trade.theirIndex + 1} does not exist.`)

    // Swap the Pokémon
    let temp = myPokemons[trade.myIndex]
    myPokemons[trade.myIndex] = theirPokemons[trade.theirIndex]
    theirPokemons[trade.theirIndex] = temp

    // Save the updated pokemons
    users[trade.from].pokemons = myPokemons
    users[sender].pokemons = theirPokemons

    // Remove the trade request
    delete tradeRequests[sender]

    return conn.reply(m.chat, `✅ Trade completed successfully! You exchanged your Pokémon with @${trade.from.split('@')[0]}.`, m, { mentions: [trade.from] })
}
