import fetch from 'node-fetch';

const API_KEY = '9746da2c-ac5f-487c-b4ae-fc55d1cd58b3'; // 🔐 Insert your personal key here

const packPrices = {
  base: 100,
  imperium: 10000000,
  premium: 1000000000000
};

const rarities = {
  base: ['Common', 'Common', 'Uncommon'],
  imperium: ['Common', 'Uncommon', 'Rare'],
  premium: ['Rare', 'Rare', 'Rare Holo'],
  darkness: ['Mysterious']
};

// Define darknessPokemons array with some default dark-type Pokémon
const darknessPokemons = [
  {
    name: "Darkrai",
    rarity: "Mysterious",
    type: "Dark",
    image: "https://images.pokemontcg.io/dp7/3_hires.png",
    hp: "110"
  },
  {
    name: "Umbreon",
    rarity: "Mysterious",
    type: "Dark",
    image: "https://images.pokemontcg.io/ecard2/H32_hires.png",
    hp: "90"
  },
  {
    name: "Tyranitar",
    rarity: "Mysterious",
    type: "Dark/Rock",
    image: "https://images.pokemontcg.io/ex15/30_hires.png",
    hp: "150"
  },
  {
    name: "Zoroark",
    rarity: "Mysterious",
    type: "Dark",
    image: "https://images.pokemontcg.io/bw6/71_hires.png",
    hp: "100"
  },
  {
    name: "Houndoom",
    rarity: "Mysterious",
    type: "Dark/Fire",
    image: "https://images.pokemontcg.io/ex15/4_hires.png",
    hp: "90"
  }
];

function convertRarityLabel(rarity) {
  switch (rarity) {
    case 'Common': return 'Common';
    case 'Uncommon': return 'Uncommon';
    case 'Rare': return 'Rare';
    case 'Rare Holo': return 'Legendary';
    case 'Mysterious': return 'Mysterious';
    default: return rarity;
  }
}

async function getRandomCardByRarity(rarity) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=rarity:"${encodeURIComponent(rarity)}"&pageSize=50`, {
      headers: { 'X-Api-Key': API_KEY }
    });

    if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);

    const json = await res.json();
    const cards = json.data || [];
    if (cards.length === 0) return null;

    const card = cards[Math.floor(Math.random() * cards.length)];
    return {
      name: card.name,
      type: card.types?.join('/') || '???',
      rarity: convertRarityLabel(rarity),
      image: card.images?.large || card.images?.small || null,
      hp: card.hp || '???',
      subtype: card.subtypes?.join(', ') || null,
      shiny: Math.random() < 0.05,
      level: Math.floor(Math.random() * 100) + 1
    };
  } catch (err) {
    console.error(`API fetch error: ${err}`);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showDarknessAnimation(conn, m, pokemon, user) {
  const animation = [
    '🌑...',
    '🌑🌑...',
    '🌑🌑🌑 *???*',
    '🌑🌑🌑 *A dark presence manifests...*',
    `✨🌑 *${pokemon.name.toUpperCase()}* emerges from the shadows!`
  ];
  for (let frame of animation) {
    await conn.sendMessage(m.chat, { text: frame, mentions: [user] }, { quoted: m });
    await delay(800);
  }
  await conn.sendMessage(m.chat, {
    image: { url: pokemon.image },
    caption: `🌑 *${pokemon.name}* (${pokemon.rarity})\n🔰 Type: ${pokemon.type} | Lvl: ${pokemon.level}${pokemon.shiny ? ' ✨ Shiny' : ''}`,
    mentions: [user]
  }, { quoted: m });
}

let handler = async (m, { conn, args }) => {
  const user = m.sender;
  global.db.data.users[user] = global.db.data.users[user] || {};
  const data = global.db.data.users[user];

  data.packInventory = data.packInventory || { base: 0, imperium: 0, premium: 0, darkness: 0 };
  data.pokemons = data.pokemons || [];

  const packType = args[0]?.toLowerCase();
  if (!['base', 'imperium', 'premium', 'darkness'].includes(packType)) {
    return m.reply(`❌ Specify a valid pack type: *base*, *imperium*, *premium* or *darkness*.\n\nExample: *.openpokemon base*`);
  }

  if ((data.packInventory[packType] || 0) <= 0) {
    return m.reply(`⛔ You don't have any *${packType.toUpperCase()}* packs. Find or use one.`);
  }

  // Remove pack
  data.packInventory[packType]--;

  await conn.sendMessage(m.chat, { text: '🎁 Opening pack...', mentions: [user] }, { quoted: m });
  await delay(1200);
  await conn.sendMessage(m.chat, { text: '✨ Revealing cards...', mentions: [user] }, { quoted: m });
  await delay(1200);

  let cards = [];

  // Darkness has predefined cards
  if (packType === 'darkness') {
    for (let i = 0; i < 3; i++) {
      const card = JSON.parse(JSON.stringify(darknessPokemons[Math.floor(Math.random() * darknessPokemons.length)]));
      card.level = Math.floor(Math.random() * 100) + 1;
      card.shiny = Math.random() < 0.05;
      cards.push(card);
    }
  } else {
    const cardPromises = rarities[packType].map(r => getRandomCardByRarity(r));
    cards = (await Promise.all(cardPromises)).filter(Boolean);

    // Initialize pity counter if doesn't exist
    data.pityCounter = data.pityCounter || 0;
    const chanceDarkness = Math.random() < 0.10;
    const pityTriggered = data.pityCounter >= 15;
    const foundDarkness = chanceDarkness || pityTriggered;

    if (foundDarkness) {
      const darkness = JSON.parse(JSON.stringify(darknessPokemons[Math.floor(Math.random() * darknessPokemons.length)]));
      darkness.level = Math.floor(Math.random() * 100) + 1;
      darkness.shiny = Math.random() < 0.05;
      cards.push(darkness);
      data.packInventory.darkness = (data.packInventory.darkness || 0) + 1;
      await showDarknessAnimation(conn, m, darkness, user);
      data.pokemons.push(darkness);
      data.pityCounter = 0;

      if (pityTriggered && !chanceDarkness) {
        await conn.sendMessage(m.chat, {
          text: `🕯️ *The dark power has answered you after much waiting...*\n🔄 _Pity_ system activated after 15 packs without Darkness.`,
          mentions: [user]
        }, { quoted: m });
      }

      return;
    } else {
      data.pityCounter++;
    }

    // Legendary Bonus
    if ((packType === 'imperium' || packType === 'premium') && Math.random() < 0.1) {
      const bonusCard = await getRandomCardByRarity('Rare Holo');
      if (bonusCard) cards.push(bonusCard);
    }
  }

  for (const card of cards) {
    data.pokemons.push({
      name: card.name,
      rarity: card.rarity,
      type: card.type,
      shiny: card.shiny,
      level: card.level
    });
  }

  if (cards.length === 0) return m.reply(`😢 No cards found. Try again.`);

  const rarityRank = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Legendary': 4, 'Mysterious': 5 };
  const best = [...cards].sort((a, b) => (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0))[0];

  const msg = `🎉 You opened a *${packType.toUpperCase()}* pack and found:\n\n` +
    `✨ *${best.name}* (${best.rarity})${best.shiny ? ' ✨ Shiny' : ''}\n` +
    `🔰 Type: ${best.type} | Lvl: ${best.level}\n\n` +
    `📦 Remaining packs: *${data.packInventory[packType]}* ${packType}`;

  const messageContent = {
    caption: msg,
    mentions: [user],
    buttons: [
      {
        buttonId: '.pity',
        buttonText: { displayText: '📊 Check Pity' },
        type: 1
      }
    ]
  };

  if (best.image) {
    await conn.sendMessage(m.chat, {
      image: { url: best.image },
      ...messageContent
    }, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, {
      text: msg,
      ...messageContent
    }, { quoted: m });
  }
};

handler.help = ['open <base|imperium|premium|darkness>'];
handler.tags = ['pokemon'];
handler.command = /^openpokemon$/i;

export default handler;
