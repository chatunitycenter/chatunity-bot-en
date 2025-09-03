const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text}) => {

const emoji2 = "😂"; // Default emoji for jokes

conn.reply(m.chat, `${emoji2} Looking for a joke, please wait...`, m)

conn.reply(m.chat, `*┏━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┓*\n\n❥ *"${pickRandom(global.jokes)}"*\n\n*┗━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┛*`, m)

}
handler.help = ['joke']
handler.tags = ['fun']
handler.command = ['joke']
handler.fail = null
handler.exp = 0
handler.group = true;
handler.register = true

export default handler

let hasil = Math.floor(Math.random() * 5000)
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a fake noodle? An impasta!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why did the coffee file a police report? It got mugged!",
  "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a fish wearing a bowtie? Sofishticated!",
  "Why did the bicycle fall over? Because it was two tired!",
  "What do you call a cow with no legs? Ground beef!",
  "Why don't melons get married? Because they cantaloupe!",
  "What do you call a boomerang that doesn't come back? A stick!",
  "Why did the tomato turn red? Because it saw the salad dressing!",
  "What do you call a parade of rabbits hopping backwards? A receding hare-line!",
  "Why was the computer cold? It left its Windows open!",
  "What do you call a sheep with no legs? A cloud!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one!"
]
