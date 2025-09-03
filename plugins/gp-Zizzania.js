let handler = async (m, {
  conn, groupMetadata
  }) => {
  if (!m.isGroup)
  throw ''
  let groups = global.db.data.chats[m.chat]
  if (groups.spacobot === false)
  throw ''
  let toM = a => '@' + a.split('@')[0]
  let ps = groupMetadata.participants.map(v => v.id)
  let a = ps.getRandom()
  let b
  do b = ps.getRandom()
  while (b === a)
  conn.reply(m.chat, `${toM(a)} ${pickRandom([
    'would love to play video games with',
    'secretly admires the fashion sense of',
    'wants to start a business with',
    'had a dream about going on adventures with',
    'thinks has the best memes in the group',
    'is secretly the biggest fan of',
    'would trust with their Netflix password',
    'believes has the best taste in music',
    'wants to go on a road trip with',
    'thinks has the funniest jokes in the group',
    'would choose as their zombie apocalypse partner',
    'secretly wants to be best friends with',
    'thinks has the most interesting stories',
    'would trust to choose their pizza toppings',
    'believes has the best dance moves in the group',
    'wants to learn the secrets of being cool from',
    'thinks has the most contagious laugh',
    'would want on their trivia team',
    'secretly wishes they could swap lives with',
    'believes has the best social media posts'
  ])} ${toM(b)}`, null, {
  mentions: [a, b]
  })}
  handler.customPrefix = /^\.chaos$/i
  handler.command = new RegExp
  export default handler
  function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
  }
