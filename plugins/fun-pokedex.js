import fetch from 'node-fetch';

const config = {
  emoji: {
    waiting: '⏳',
    completed: '✅',
    error: '❌'
  },
  meta: {
    developer: 'ChatUnity',
    icon: 'https://i.imgur.com/example.png', // URL immagine valido
    channel: 'https://example.com'
  }
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '🚩 Inserisci il nome di un Pokémon', m);

  try {
    // Reazione durante la ricerca
    await m.react(config.emoji.waiting);
    
    // Messaggio di ricerca (modificato per evitare problemi con externalAdReply)
    await conn.sendMessage(m.chat, { 
      text: `🔍 Sto cercando ${text}...`,
      contextInfo: {
        mentionedJid: [m.sender]
      }
    });

    // Richiesta API
    const url = `https://some-random-api.com/pokemon/pokedex?pokemon=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API non disponibile');

    const pokemon = await response.json();
    if (!pokemon?.name) throw new Error('Pokémon non trovato');

    // Formattazione risposta
    const pokemonInfo = `
🎌 *Pokédex - ${pokemon.name}*

🔹 *Nome:* ${pokemon.name}
🔹 *ID:* ${pokemon.id}
🔹 *Tipo:* ${Array.isArray(pokemon.type) ? pokemon.type.join(', ') : pokemon.type}
🔹 *Abilità:* ${Array.isArray(pokemon.abilities) ? pokemon.abilities.join(', ') : pokemon.abilities}
🔹 *Altezza:* ${pokemon.height}
🔹 *Peso:* ${pokemon.weight}

📝 *Descrizione:*
${pokemon.description || 'Nessuna descrizione disponibile'}

🌐 *Maggiori info:*
https://www.pokemon.com/it/pokedex/${encodeURIComponent(pokemon.name.toLowerCase())}
    `.trim();

    // Invio messaggio con info Pokémon
    await conn.sendMessage(m.chat, { 
      text: pokemonInfo,
      mentions: [m.sender]
    });
    
    await m.react(config.emoji.completed);

  } catch (error) {
    console.error('Errore ricerca Pokémon:', error);
    await m.react(config.emoji.error);
    await conn.sendMessage(m.chat, { 
      text: '⚠️ Errore nella ricerca del Pokémon',
      mentions: [m.sender]
    });
  }
};

handler.help = ['pokedex <pokémon>'];
handler.tags = ['utility', 'games'];
handler.command = ['pokedex', 'pokemon'];
export default handler;
