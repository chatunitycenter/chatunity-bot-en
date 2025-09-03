let leaderboardHandler = async (m, { conn }) => {
  let users = Object.entries(global.db.data.users)
    .map(([id, data]) => ({
      id,
      name: data.name || id,
      count: data.pokemons?.length || 0
    }))
    .filter(u => u.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  if (users.length === 0) {
    return m.reply('😢 No collectors found.')
  }

  let rankMsg = `🏆 *Top 10 Pokémon Collectors*:\n\n` + users.map((u, i) =>
    `${i + 1}. ${u.name} - ${u.count} Pokémon`
  ).join('\n')

  m.reply(rankMsg)
}

leaderboardHandler.help = ['leaderboard']
leaderboardHandler.tags = ['pokemon']
leaderboardHandler.command = /^pokedexleaderboard$/i

export default leaderboardHandler
