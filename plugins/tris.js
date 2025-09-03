import TicTacToe from '../lib/tictactoe.js';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.game = conn.game ? conn.game : {};

  // Check if the user is already playing
  if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) {
    throw '*[❗] YOU ARE ALREADY IN A GAME WITH SOMEONE*';
  }

  // Ensure the user provides a room name
  if (!text) {
    throw `*[❗] YOU NEED TO PROVIDE A ROOM NAME*\n\n*—◉ EXAMPLE:*\n*◉ ${usedPrefix + command} room1*\n*◉ ${usedPrefix + command} myroom*`;
  }

  // Find a room that is waiting for players
  let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true));

  if (room) {
    // Join existing room and start the game
    await m.reply('[🎮] **GAME IS STARTING!** A PLAYER HAS JOINED THE ROOM');
    room.o = m.chat;
    room.game.playerO = m.sender;
    room.state = 'PLAYING';

    // Map the game board to emojis
    let arr = room.game.render().map(v => {
      return {
        X: '❌',
        O: '⭕',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
      }[v] || v;
    });

    // Create the game board message
    let str = `*🎯 TIC TAC TOE GAME*\n\n`;
    str += `*Room:* ${room.name}\n`;
    str += `*Players:*\n`;
    str += `❌ Player X: @${room.game.playerX.split('@')[0]}\n`;
    str += `⭕ Player O: @${room.game.playerO.split('@')[0]}\n\n`;
    str += `*Current turn:* @${room.game.currentTurn.split('@')[0]}\n\n`;
    str += `*Game Board:*\n`;
    str += `     ${arr.slice(0, 3).join(' ')}\n`;
    str += `     ${arr.slice(3, 6).join(' ')}\n`;
    str += `     ${arr.slice(6, 9).join(' ')}\n\n`;
    str += `*Instructions:*\n`;
    str += `• Type the number (1-9) to place your mark\n`;
    str += `• Wait for your turn\n`;
    str += `• First to get 3 in a row wins!\n\n`;
    str += `*To quit the game, type:* quit`;

    // Send to both players
    if (room.x !== room.o) {
      await conn.sendMessage(room.x, { 
        text: str, 
        mentions: [room.game.playerX, room.game.playerO] 
      });
    }
    
    await conn.sendMessage(room.o, { 
      text: str, 
      mentions: [room.game.playerX, room.game.playerO] 
    });

  } else {
    // Create new room
    room = {
      id: 'tictactoe-' + (+new Date),
      name: text,
      x: m.chat,
      o: '',
      game: new TicTacToe(m.sender, 'o'),
      state: 'WAITING'
    };
    
    if (text) room.name = text;
    conn.game[room.id] = room;
    
    await m.reply(`*[🎮] ROOM CREATED SUCCESSFULLY*\n\n*Room Name:* ${text}\n*Creator:* @${m.sender.split('@')[0]}\n*Status:* Waiting for opponent...\n\n*Share this room name with someone to start playing:*\n\`${usedPrefix + command} ${text}\``, null, {
      mentions: [m.sender]
    });
  }
};

handler.help = ['tictactoe', 'ttt', 'xo'];
handler.tags = ['games'];
handler.command = /^(tictactoe|ttt|xo)$/i;

export default handler;
