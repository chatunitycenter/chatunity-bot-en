import { format } from 'util';

let debugMode = false;
let winScore = 4999;
let playScore = 99;

export async function before(m) {
  let ok;
  let isWin = false;
  let isTie = false;
  let isSurrender = false;

  this.game = this.game ? this.game : {};

  // Find a Tic-Tac-Toe game room the sender is part of and is currently playing
  let room = Object.values(this.game).find(room => 
    room.id && room.game && room.state && room.id.startsWith('tictactoe') && 
    [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING'
  );

  if (room) {
    // Check if the text is a valid move or surrender action
    if (!/^([1-9]|(me)?surrender|\rendirse\|rendirse|RENDIRSE|surr?ender)$/i.test(m.text)) {
      return true;
    }

    // If it's a surrender move
    isSurrender = !/^[1-9]$/.test(m.text);

    // If it's not the current player's turn, do nothing
    if (m.sender !== room.game.currentTurn) {
      if (!isSurrender) return true;
    }

    // Debugging information
    if (debugMode) {
      m.reply('[DEBUG]\n' + require('util').format({
        isSurrender,
        text: m.text
      }));
    }

    // Handle the move or surrender
    if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
      m.reply({
        '-3': 'The game has ended',
        '-2': 'Invalid move',
        '-1': 'Incorrect position',
        0: 'Incorrect position',
      }[ok]);
      return true;
    }

    // Determine if there's a winner or a tie
    if (m.sender === room.game.winner) {
      isWin = true;
    } else if (room.game.board === 511) {
      isTie = true;
    }

    // Create a representation of the game board with emojis
    let arr = room.game.render().map(v => {
      return {
        X: '❎',
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
      }[v];
    });

    // If the player surrenders, mark the current turn as the winner
    if (isSurrender) {
      room.game._currentTurn = m.sender === room.game.playerX;
      isWin = true;
    }

    let winner = isSurrender ? room.game.currentTurn : room.game.winner;
    let str = `

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

${isWin ? `@${(isSurrender ? room.game.currentTurn : room.game.winner).split('@')[0]} has won a cookie 🍪` : 
  isTie ? 'Tie!' : `Turn of @${room.game.currentTurn.split('@')[0]}`}
`.trim();

    // Update the room state and player turns
    let users = global.db.data.users;
    if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat) {
      room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat;
    }

    // Send the game status to both players
    if (room.x !== room.o) await this.sendMessage(room.x, { text: str, mentions: this.parseMention(str)}, { quoted: m });
    await this.sendMessage(room.o, { text: str, mentions: this.parseMention(str)}, { quoted: m });

    // If the game ended (win or tie), update the players' experience points
    if (isTie || isWin) {
      users[room.game.playerX].exp += playScore;
      users[room.game.playerO].exp += playScore;
      if (isWin) {
        users[winner].exp += winScore - playScore;
      }
      if (debugMode) {
        m.reply('[DEBUG]\n' + format(room));
      }

      // Delete the game room after the game ends
      delete this.game[room.id];
    }
  }
  return true;
          }
