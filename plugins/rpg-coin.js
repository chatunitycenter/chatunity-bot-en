import fetch from 'node-fetch'

const rarityCosts = {
  'Common': 100,
  'Uncommon': 1000,
  'Rare': 10000,
  'Legendary': 100000
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getEvolution(name) {
  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`)
    if (!speciesRes.ok) return null
    const speciesData = await speciesRes.json()
    const evoChainUrl = speciesData.evolution_chain?.url
    if (!evoChainUrl) return null

    const evoRes = await fetch(evoChainUrl)
    if (!evoRes.ok) return null
    const evoData = await evoRes.json()

    function findNextEvolution(chain) {
      if (chain.species.name.toLowerCase() === name.toLowerCase()) {
        return chain.evolves_to?.[0]?.species?.name || null
      }
      for (const evo of chain.evolves_to) {
        const result = findNextEvolution(evo)
        if (result) return result
      }
      return null
    }

    const nextEvo = findNextEvolution(evoData.chain)
    return nextEvo
  } catch (err) {
    console.error('Error retrieving evolution:', err)
    return null
  }
}

let handler = async (m, { conn, args }) => {
  const user = m.sender
  global.db.data.users[user] = global.db.data.users[user] || {}
  const data = global.db.data.users[user]

  data.limit = data.limit || 0 // Unitycoins instead of mattecash
  data.pokemons = data.pokemons || []

  const name = args.join(' ')
  if (!name) return m.reply('📛 Specify the name of the Pokémon to evolve.\nExample: *.evolve Charmander*')

  const baseCard = data.pokemons.find(p => p.name.toLowerCase() === name.toLowerCase())
  if (!baseCard) return m.reply(`❌ You don't own *${name}*`)

  const cost = rarityCosts[baseCard.rarity]
  if (data.limit < cost) { // Check limits (unitycoins) instead of mattecash
    return m.reply(`⛔ You don't have enough Unitycoins!\n💰 You have: *${data.limit} UC*\n💸 Required: *${cost} UC*`)
  }

  const nextForm = await getEvolution(baseCard.name)
  if (!nextForm) return m.reply(`⛔ *${baseCard.name}* cannot evolve further.`)

  data.limit -= cost // Subtract from unitycoins

  await conn.sendMessage(m.chat, { text: `✨ *${baseCard.name}* is evolving...`, mentions: [user] }, { quoted: m })
  await sleep(1000)
  await conn.sendMessage(m.chat, { text: '🔄 Evolution in progress...', mentions: [user] }, { quoted: m })
  await sleep(1000)
  await conn.sendMessage(m.chat, { text: `🎉 *${baseCard.name}* evolved into *${nextForm}*!`, mentions: [user] }, { quoted: m })

  const index = data.pokemons.indexOf(baseCard)
  if (index > -1) {
    data.pokemons.splice(index, 1)
  }

  data.pokemons.push({
    name: nextForm,
    rarity: baseCard.rarity,
    type: baseCard.type
  })

  return m.reply(`✅ Evolution completed!\n💰 Unitycoins remaining: *${data.limit} UC*`)
}

handler.help = ['evolve <name>']
handler.tags = ['pokemon']
handler.command = /^evolve$/i

export default handler
