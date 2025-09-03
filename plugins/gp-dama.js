import { createCanvas } from 'canvas';

class CheckersGame {
    constructor(playerId) {
        this.board = this.initializeBoard();
        this.currentPlayer = 'W'; // W: White, B: Black
        this.selectedPiece = null;
        this.validMoves = [];
        this.mustCapture = false;
        this.gameOver = false;
        this.winner = null;
        this.playerId = playerId;
        this.startTime = Date.now();
        this.id = null;
        this.timeoutId = null;
    }

    initializeBoard() {
        // Create 8x8 board
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Place initial pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Pieces only on dark squares
                if ((row + col) % 2 === 1) {
                    if (row < 3) {
                        board[row][col] = { type: 'piece', color: 'B' };
                    } else if (row > 4) {
                        board[row][col] = { type: 'piece', color: 'W' };
                    }
                }
            }
        }
        return board;
    }

    selectPiece(row, col) {
        if (this.gameOver) return { error: "The game is already over!" };
        
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) {
            return { error: "Select one of your pieces!" };
        }

        // Find all possible moves (prioritizing captures)
        const allMoves = this.findValidMoves(row, col);
        
        // If there are mandatory captures elsewhere, you must capture
        if (this.mustCapture && !allMoves.some(move => move.captures.length > 0)) {
            return { error: "You must capture if possible!" };
        }

        this.selectedPiece = { row, col };
        this.validMoves = allMoves;
        
        return { success: true, moves: allMoves };
    }

    findValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        const moves = [];
        const directions = [];
        
        // Determine directions based on piece type and color
        if (piece.type === 'king') {
            directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        } else {
            // Normal pieces move forward relative to their color
            if (piece.color === 'W') {
                directions.push([-1, -1], [-1, 1]);
            } else {
                directions.push([1, -1], [1, 1]);
            }
        }
        
        // Search for normal moves and captures
        for (const [dr, dc] of directions) {
            this.checkDirection(row, col, dr, dc, piece, moves, []);
        }
        
        // If there are captures, return only those (captures are mandatory)
        const captures = moves.filter(move => move.captures.length > 0);
        if (captures.length > 0) {
            return captures;
        }
        
        return moves;
    }

    checkDirection(row, col, dr, dc, piece, moves, captures, isCaptureSequence = false) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        // Check if we're outside the board
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return;
        
        const targetCell = this.board[newRow][newCol];
        
        if (!targetCell) {
            // Empty square - valid move
            if (!isCaptureSequence || captures.length > 0) {
                moves.push({
                    row: newRow,
                    col: newCol,
                    captures: [...captures],
                    becomesKing: this.shouldBecomeKing(newRow, piece.color)
                });
            }
            
            // For normal pieces, only one step (unless it's a capture sequence)
            if (piece.type === 'piece' && captures.length === 0) return;
            
            // For kings or during capture, continue checking
            if (piece.type === 'king' || isCaptureSequence) {
                this.checkDirection(newRow, newCol, dr, dc, piece, moves, captures, isCaptureSequence);
            }
        } else if (targetCell.color !== piece.color) {
            // There's an opponent's piece - check if we can capture it
            const jumpRow = newRow + dr;
            const jumpCol = newCol + dc;
            
            // Check if we can jump over the opponent's piece
            if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && 
                !this.board[jumpRow][jumpCol]) {
                
                // Add this capture to the list
                const newCaptures = [...captures, { row: newRow, col: newCol }];
                
                // Continue with capture sequence
                this.checkDirection(jumpRow, jumpCol, dr, dc, piece, moves, newCaptures, true);
                
                // For kings, check other directions after capture
                if (piece.type === 'king') {
                    const otherDirections = [
                        [-dr, -dc], [-dr, dc], [dr, -dc]
                    ].filter(([r, c]) => r !== dr || c !== dc);
                    
                    for (const [odr, odc] of otherDirections) {
                        this.checkDirection(jumpRow, jumpCol, odr, odc, piece, moves, newCaptures, true);
                    }
                }
            }
        }
    }

    shouldBecomeKing(row, color) {
        return (color === 'W' && row === 0) || (color === 'B' && row === 7);
    }

    movePiece(toRow, toCol) {
        if (this.gameOver) return { error: "The game is already over!" };
        if (!this.selectedPiece) return { error: "You must first select a piece!" };
        
        const { row: fromRow, col: fromCol } = this.selectedPiece;
        const move = this.validMoves.find(m => m.row === toRow && m.col === toCol);
        
        if (!move) return { error: "Invalid move!" };
        
        // Execute the move
        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Remove captured pieces
        for (const capture of move.captures) {
            this.board[capture.row][capture.col] = null;
        }
        
        // Promote to king if necessary
        if (move.becomesKing) {
            this.board[toRow][toCol] = { type: 'king', color: piece.color };
        }
        
        // Check if the game is over
        this.checkGameOver();
        
        // Prepare for next turn
        const hadCapture = move.captures.length > 0;
        let mustContinueCapture = false;
        
        // If there was a capture, check if more are possible
        if (hadCapture) {
            const furtherCaptures = this.findValidMoves(toRow, toCol)
                .filter(m => m.captures.length > 0);
            
            if (furtherCaptures.length > 0) {
                mustContinueCapture = true;
                this.selectedPiece = { row: toRow, col: toCol };
                this.validMoves = furtherCaptures;
            }
        }
        
        if (!mustContinueCapture) {
            this.currentPlayer = this.currentPlayer === 'W' ? 'B' : 'W';
            this.selectedPiece = null;
            this.validMoves = [];
            
            // Check if next player must capture
            this.mustCapture = this.checkMustCapture();
        }
        
        return { 
            success: true, 
            hadCapture,
            mustContinueCapture,
            gameOver: this.gameOver,
            winner: this.winner
        };
    }

    checkMustCapture() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const moves = this.findValidMoves(row, col);
                    if (moves.some(move => move.captures.length > 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkGameOver() {
        // Check if a player has no more pieces
        let blackPieces = 0;
        let whitePieces = 0;
        let blackCanMove = false;
        let whiteCanMove = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece.color === 'W') {
                        whitePieces++;
                        if (!whiteCanMove) {
                            const moves = this.findValidMoves(row, col);
                            if (moves.length > 0) whiteCanMove = true;
                        }
                    } else {
                        blackPieces++;
                        if (!blackCanMove) {
                            const moves = this.findValidMoves(row, col);
                            if (moves.length > 0) blackCanMove = true;
                        }
                    }
                }
            }
        }
        
        if (whitePieces === 0 || !whiteCanMove) {
            this.gameOver = true;
            this.winner = 'B';
        } else if (blackPieces === 0 || !blackCanMove) {
            this.gameOver = true;
            this.winner = 'W';
        }
    }

    async generateBoardImage() {
        const cellSize = 70;
        const padding = 30;
        const boardSize = 8 * cellSize;
        const canvasWidth = boardSize + padding * 2;
        const canvasHeight = boardSize + padding * 2;
        
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        
        // Colors
        const colors = {
            light: '#F0D9B5',
            dark: '#B58863',
            highlight: 'rgba(155, 199, 0, 0.6)',
            selected: 'rgba(255, 215, 0, 0.6)',
            whitePiece: '#FFFFFF',
            blackPiece: '#000000',
            whiteKing: '#FFD700',
            blackKing: '#8B4513',
            border: '#000000',
            bg: '#2C2C2C'
        };
        
        // Background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const x = padding + col * cellSize;
                const y = padding + row * cellSize;
                
                // Square
                ctx.fillStyle = (row + col) % 2 === 0 ? colors.light : colors.dark;
                ctx.fillRect(x, y, cellSize, cellSize);
                
                // Highlight valid moves
                if (this.selectedPiece && 
                    this.validMoves.some(move => move.row === row && move.col === col)) {
                    ctx.fillStyle = colors.highlight;
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
                
                // Highlight selected piece
                if (this.selectedPiece && 
                    this.selectedPiece.row === row && this.selectedPiece.col === col) {
                    ctx.fillStyle = colors.selected;
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
                
                // Draw pieces
                const piece = this.board[row][col];
                if (piece) {
                    const centerX = x + cellSize / 2;
                    const centerY = y + cellSize / 2;
                    const radius = cellSize * 0.4;
                    
                    // Piece
                    ctx.fillStyle = piece.color === 'W' ? colors.whitePiece : colors.blackPiece;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = colors.border;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // King (inner circle)
                    if (piece.type === 'king') {
                        const innerRadius = radius * 0.5;
                        ctx.fillStyle = piece.color === 'W' ? colors.whiteKing : colors.blackKing;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Add row and column indices
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Column letters (A-H)
        for (let col = 0; col < 8; col++) {
            const x = padding + col * cellSize + cellSize / 2;
            const yTop = padding - 10;
            const yBottom = padding + boardSize + 10;
            
            ctx.fillText(String.fromCharCode(65 + col), x, yTop);
            ctx.fillText(String.fromCharCode(65 + col), x, yBottom);
        }
        
        // Row numbers (1-8)
        for (let row = 0; row < 8; row++) {
            const y = padding + row * cellSize + cellSize / 2;
            const xLeft = padding - 10;
            const xRight = padding + boardSize + 10;
            
            ctx.fillText((8 - row).toString(), xLeft, y);
            ctx.fillText((8 - row).toString(), xRight, y);
        }
        
        // Add game information
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Turn: ${this.currentPlayer === 'W' ? 'White' : 'Black'}`, 
                     canvasWidth / 2, 20);
        
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(canvasWidth / 4, canvasHeight / 3, canvasWidth / 2, canvasHeight / 3);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 20);
            ctx.fillText(`Winner: ${this.winner === 'W' ? 'White' : 'Black'}`, 
                         canvasWidth / 2, canvasHeight / 2 + 20);
        }
        
        return canvas.toBuffer('image/png');
    }
}

global.checkersGame = global.checkersGame || {};

async function handleGameTimeout(conn, chat, gameId, playerId) {
    const currentGame = global.checkersGame?.[chat];
    
    if (!currentGame || currentGame.id !== gameId) return;
    
    try {
        currentGame.gameOver = true;
        currentGame.winner = currentGame.currentPlayer === 'W' ? 'B' : 'W';
        
        let timeoutText = `ㅤ⋆｡˚『 ╭ \`TIME'S UP!\` ╯ 』˚｡⋆\n╭\n`;
        timeoutText += `│ 『 🎯 』 \`Winner:\` *${currentGame.winner === 'W' ? 'White' : 'Black'}*\n`;
        timeoutText += `│ 『 💡 』 _*Be faster next time*_\n`;
        timeoutText += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '♟️ Play Again!', id: `.checkers` })
        }];

        await conn.sendMessage(chat, {
            text: timeoutText,
            footer: 'Checkers Bot',
            interactiveButtons: buttons
        });
        
        delete global.checkersGame[chat];
    } catch (error) {
        console.error('[CHECKERS] Error during timeout handling:', error);
        delete global.checkersGame[chat];
    }
}

async function startGame(conn, m, usedPrefix) {
    const chat = m.chat;

    if (global.checkersGame?.[chat]) {
        return conn.reply(m.chat, '『 ⚠️ 』 \`There is already an active checkers game!\`', m);
    }

    const cooldownKey = `checkers_${chat}`;
    global.cooldowns = global.cooldowns || {};
    const lastGame = global.cooldowns[cooldownKey] || 0;
    const now = Date.now();
    const cooldownTime = 5000;

    if (now - lastGame < cooldownTime) {
        const remainingTime = Math.ceil((cooldownTime - (now - lastGame)) / 1000);
        return conn.reply(m.chat, `『 ⏳ 』 *Wait ${remainingTime} more seconds before starting a new game!*`, m);
    }
    
    try {
        const newGame = new CheckersGame(m.sender);
        const boardImage = await newGame.generateBoardImage();

        let startCaption = `ㅤ⋆｡˚『 ╭ \`INTERNATIONAL CHECKERS\` ╯ 』˚｡⋆\n╭\n`;
        startCaption += `│ 『 🎯 』 \`Turn:\` *${newGame.currentPlayer === 'W' ? 'White' : 'Black'}*\n`;
        startCaption += `│ 『 ⚡ 』 \`Select a piece with .select A2\`\n`;
        startCaption += `│ 『 ⏱️ 』 \`2 minutes\` of time \`per move\`\n`;
        startCaption += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

        let msg = await conn.sendMessage(chat, { 
            image: boardImage, 
            caption: startCaption,
            footer: 'Checkers Bot'
        }, { quoted: m });

        global.checkersGame[chat] = newGame;
        global.checkersGame[chat].id = msg.key.id;
        global.cooldowns[cooldownKey] = now;

        const timeoutId = setTimeout(() => {
            handleGameTimeout(conn, chat, msg.key.id, m.sender);
        }, 120000); // 2 minutes

        global.checkersGame[chat].timeoutId = timeoutId;

    } catch (error) {
        console.error('Error starting Checkers game:', error);
        await conn.reply(m.chat, `An error occurred while starting the game.`, m);
    }
}

let handler = async (m, { conn, command, usedPrefix, text }) => {
    if (command === 'skipcheckers') {
        const game = global.checkersGame?.[m.chat];
        if (!game) return conn.reply(m.chat, '⚠️ There is no active checkers game in this group!', m);

        const groupMeta = await conn.groupMetadata(m.chat).catch(() => null);
        const participant = groupMeta?.participants.find(p => p.id === m.sender);
        const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';

        if (!isAdmin && m.sender !== game.playerId && !m.fromMe) {
            return conn.reply(m.chat, '❌ *This command can only be used by admins or the game starter!*', m);
        }

        clearTimeout(game.timeoutId);
        const boardImage = await game.generateBoardImage();
        
        let skipCaption = `ㅤ⋆｡˚『 ╭ \`GAME INTERRUPTED\` ╯ 』˚｡⋆\n╭\n`;
        skipCaption += `│ 『 🎯 』 \`Game interrupted\`\n`;
        skipCaption += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;

        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '♟️ Play Again!', id: `.checkers` })
        }];

        await conn.sendMessage(m.chat, {
            image: boardImage,
            caption: skipCaption,
            footer: 'Checkers Bot',
            interactiveButtons: buttons
        }, { quoted: m });
        delete global.checkersGame[m.chat];
        return;
    }

    if (command === 'checkers') {
        await startGame(conn, m, usedPrefix);
    }

    if (command === 'select' && global.checkersGame?.[m.chat]) {
        const game = global.checkersGame[m.chat];
        
        // Convert chess notation (e.g., A2) to coordinates (row, column)
        const notation = text.trim().toUpperCase();
        if (!/^[A-H][1-8]$/.test(notation)) {
            return conn.reply(m.chat, '❌ *Invalid notation! Use format like A2, B3, etc.*', m);
        }
        
        const col = notation.charCodeAt(0) - 65;
        const row = 8 - parseInt(notation[1]);
        
        const result = game.selectPiece(row, col);
        if (result.error) {
            return conn.reply(m.chat, result.error, m);
        }
        
        const boardImage = await game.generateBoardImage();
        let caption = `ㅤ⋆｡˚『 ╭ \`PIECE SELECTED\` ╯ 』˚｡⋆\n╭\n`;
        caption += `│ 『 🎯 』 \`Position:\` *${notation}*\n`;
        caption += `│ 『 ⚡ 』 \`Available moves:\` *${result.moves.length}*\n`;
        caption += `│ 『 💡 』 \`Use .move [position] to move\`\n`;
        caption += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        
        await conn.sendMessage(m.chat, {
            image: boardImage,
            caption: caption,
            footer: 'Checkers Bot'
        }, { quoted: m });
    }

    if (command === 'move' && global.checkersGame?.[m.chat]) {
        const game = global.checkersGame[m.chat];
        
        if (!game.selectedPiece) {
            return conn.reply(m.chat, '❌ *You must first select a piece with .select!*', m);
        }
        
        const notation = text.trim().toUpperCase();
        if (!/^[A-H][1-8]$/.test(notation)) {
            return conn.reply(m.chat, '❌ *Invalid notation! Use format like A2, B3, etc.*', m);
        }
        
        const col = notation.charCodeAt(0) - 65;
        const row = 8 - parseInt(notation[1]);
        
        const result = game.movePiece(row, col);
        if (result.error) {
            return conn.reply(m.chat, result.error, m);
        }
        
        clearTimeout(game.timeoutId);
        const boardImage = await game.generateBoardImage();
        
        let caption = `ㅤ⋆｡˚『 ╭ \`MOVE MADE\` ╯ 』˚｡⋆\n╭\n`;
        caption += `│ 『 🎯 』 \`To:\` *${notation}*\n`;
        if (result.hadCapture) {
            caption += `│ 『 ⚔️ 』 \`Capture made!\`\n`;
        }
        
        if (result.mustContinueCapture) {
            caption += `│ 『 ⚡ 』 \`You must continue capturing!\`\n`;
        } else if (!result.gameOver) {
            caption += `│ 『 🔄 』 \`Turn:\` *${game.currentPlayer === 'W' ? 'White' : 'Black'}*\n`;
        }
        
        if (result.gameOver) {
            caption += `│ 『 🏆 』 \`Winner:\` *${result.winner === 'W' ? 'White' : 'Black'}*\n`;
        }
        
        caption += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`;
        
        const buttons = [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '♟️ New Game', id: `.checkers` })
        }];
        
        let msg = await conn.sendMessage(m.chat, {
            image: boardImage,
            caption: caption,
            footer: 'Checkers Bot',
            interactiveButtons: result.gameOver ? buttons : undefined
        }, { quoted: m });
        
        if (!result.gameOver) {
            game.id = msg.key.id;
            const newTimeoutId = setTimeout(() => {
                handleGameTimeout(conn, m.chat, msg.key.id, game.playerId);
            }, 120000);
            game.timeoutId = newTimeoutId;
        } else {
            delete global.checkersGame[m.chat];
        }
    }
};

handler.before = async (m, { conn, usedPrefix }) => {
    // Not necessary for checkers as we use specific commands
};

setInterval(() => {
    const now = Date.now();
    for (const [chat, game] of Object.entries(global.checkersGame || {})) {
        if (now - game.startTime > 1800000) { // 30 minutes of inactivity
            console.log(`[CHECKERS CLEANUP] Removing inactive game in chat ${chat}`);
            clearTimeout(game.timeoutId);
            delete global.checkersGame[chat];
        }
    }
}, 60000);

handler.help = ['checkers', 'select [position]', 'move [position]', 'skipcheckers'];
handler.tags = ['games'];
handler.command = /^(checkers|select|move|skipcheckers)$/i;
handler.group = true;
handler.register = true;

export default handler;
