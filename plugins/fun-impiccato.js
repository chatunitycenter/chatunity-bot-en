import { createCanvas } from 'canvas';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const HANGMAN_WIDTH = 300;
const HANGMAN_HEIGHT = 300;

class HangmanGame {
    constructor(userId, userData) {
        this.userId = userId;
        this.userData = userData;
        this.words = this.getWordList();
        this.currentWord = '';
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.maxAttempts = 6;
        this.attemptsLeft = 6;
        this.gameState = 'waiting'; // waiting, playing, won, lost
        this.betAmount = 0;
        this.prizeMultiplier = 0;
        this.startTime = Date.now();
    }

    getWordList() {
        return [
            'COMPUTER', 'PHONE', 'TREE', 'SUN', 'MOON', 'STAR',
            'SEA', 'MOUNTAIN', 'FLOWER', 'ANIMAL', 'BOOK', 'SCHOOL',
            'FRIEND', 'FAMILY', 'CITY', 'TOWN', 'CAR', 'BICYCLE',
            'TRAVEL', 'MUSIC', 'ART', 'SPORT', 'GAME', 'WORK',
            'HOUSE', 'KITCHEN', 'ROOM', 'GARDEN', 'TIME', 'SKY',
            'CLOUD', 'RAIN', 'SNOW', 'WIND', 'FIRE', 'WATER',
            'EARTH', 'AIR', 'LIVINGROOM', 'BATHROOM', 'BED', 'TABLE',
            'CHAIR', 'WINDOW', 'DOOR', 'MIRROR', 'PAINTING', 'SHOES',
            'CLOTHES', 'SHIRT', 'PANTS', 'SHOES', 'HAT', 'GLOVES',
            'SCARF', 'WATCH', 'GLASSES', 'JEWELRY', 'RING', 'BRACELET',
            'NECKLACE', 'EARRINGS', 'BAG', 'BACKPACK', 'SUITCASE', 'BRIEFCASE',
            'PEN', 'PENCIL', 'NOTEBOOK', 'PAPER', 'BOOK', 'MAGAZINE',
            'NEWSPAPER', 'TELEVISION', 'RADIO', 'INTERNET', 'PHONE', 'TABLET',
            'APP', 'SOCIAL', 'EMAIL', 'MESSAGE', 'CALL', 'VIDEO',
            'PHOTO', 'CAMERA', 'MICROPHONE', 'SPEAKER', 'HEADPHONES', 'KEYBOARD',
            'MOUSE', 'MONITOR', 'PRINTER', 'SCANNER', 'ROUTER', 'CABLE'
        ];
    }

    startGame(betAmount) {
        if (this.gameState === 'playing') return { error: "⚠️ Game already in progress!" };
        if (betAmount > this.userData.limit) return { error: "💰 Insufficient funds!" };

        this.betAmount = betAmount;
        this.userData.limit -= betAmount;
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.attemptsLeft = this.maxAttempts;
        this.gameState = 'playing';
        this.prizeMultiplier = 0;

        return { 
            success: true, 
            wordLength: this.currentWord.length,
            attempts: this.attemptsLeft 
        };
    }

    guessLetter(letter) {
        if (this.gameState !== 'playing') return { error: "❌ No game in progress!" };
        if (this.guessedLetters.includes(letter) || this.wrongLetters.includes(letter)) {
            return { error: "❌ Letter already tried!" };
        }

        letter = letter.toUpperCase();
        
        if (this.currentWord.includes(letter)) {
            this.guessedLetters.push(letter);
            
            // Check if won
            const hasWon = this.currentWord.split('').every(char => 
                char === ' ' || this.guessedLetters.includes(char)
            );
            
            if (hasWon) {
                this.calculatePrize();
                this.gameState = 'won';
                return { 
                    success: true, 
                    correct: true, 
                    won: true,
                    prize: this.betAmount * this.prizeMultiplier
                };
            }
            
            return { success: true, correct: true };
        } else {
            this.wrongLetters.push(letter);
            this.attemptsLeft--;
            
            if (this.attemptsLeft === 0) {
                this.gameState = 'lost';
                return { 
                    success: true, 
                    correct: false, 
                    lost: true,
                    word: this.currentWord 
                };
            }
            
            return { success: true, correct: false, attemptsLeft: this.attemptsLeft };
        }
    }

    calculatePrize() {
        const lettersGuessed = this.guessedLetters.length;
        const totalLetters = new Set(this.currentWord.replace(/ /g, '')).size;
        const accuracy = lettersGuessed / totalLetters;
        
        // Multiplier based on accuracy and remaining attempts
        this.prizeMultiplier = 2 + (accuracy * 3) + (this.attemptsLeft * 0.5);
        this.userData.limit += this.betAmount * this.prizeMultiplier;
    }

    getDisplayWord() {
        return this.currentWord.split('').map(char => 
            char === ' ' ? '   ' : (this.guessedLetters.includes(char) ? char : '_')
        ).join(' ');
    }

    async generateHangmanImage() {
        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx = canvas.getContext('2d');

        // Background
        const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#34495e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎯 HANGMAN', CANVAS_WIDTH / 2, 40);

        // Draw gallows
        this.drawGallows(ctx);

        // Draw hangman based on errors
        this.drawHangman(ctx);

        // Word to guess
        const displayWord = this.getDisplayWord();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(displayWord, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 120);

        // Wrong letters
        if (this.wrongLetters.length > 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = '18px Arial';
            ctx.fillText(`Wrong letters: ${this.wrongLetters.join(', ')}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 90);
        }

        // Attempts left
        ctx.fillStyle = this.attemptsLeft <= 2 ? '#e74c3c' : '#f39c12';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Attempts: ${this.attemptsLeft}/${this.maxAttempts}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 60);

        // Game info
        ctx.fillStyle = '#bdc3c7';
        ctx.font = '14px Arial';
        ctx.fillText(`💶 Bet: ${this.formatNumber(this.betAmount)} UC`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);

        if (this.gameState === 'won') {
            ctx.fillStyle = '#27ae60';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(`🎉 WON: ${this.formatNumber(this.betAmount * this.prizeMultiplier)} UC!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150);
        } else if (this.gameState === 'lost') {
            ctx.fillStyle = '#e74c3c';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(`💀 Word: ${this.currentWord}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 150);
        }

        return canvas.toBuffer('image/png');
    }

    drawGallows(ctx) {
        const centerX = CANVAS_WIDTH / 2;
        const gallowsTop = 80;
        const gallowsLeft = centerX - 100;
        const gallowsRight = centerX + 100;
        const gallowsBottom = 300;

        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        // Base
        ctx.beginPath();
        ctx.moveTo(gallowsLeft, gallowsBottom);
        ctx.lineTo(gallowsRight, gallowsBottom);
        ctx.stroke();

        // Vertical pole
        ctx.beginPath();
        ctx.moveTo(centerX, gallowsBottom);
        ctx.lineTo(centerX, gallowsTop);
        ctx.stroke();

        // Horizontal beam
        ctx.beginPath();
        ctx.moveTo(centerX, gallowsTop);
        ctx.lineTo(centerX + 80, gallowsTop);
        ctx.stroke();

        // Rope
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX + 80, gallowsTop);
        ctx.lineTo(centerX + 80, gallowsTop + 40);
        ctx.stroke();
    }

    drawHangman(ctx) {
        const headX = CANVAS_WIDTH / 2 + 80;
        const headY = 120;
        const errors = this.maxAttempts - this.attemptsLeft;

        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        if (errors >= 1) {
            // Head
            ctx.beginPath();
            ctx.arc(headX, headY, 20, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (errors >= 2) {
            // Body
            ctx.beginPath();
            ctx.moveTo(headX, headY + 20);
            ctx.lineTo(headX, headY + 80);
            ctx.stroke();
        }

        if (errors >= 3) {
            // Left arm
            ctx.beginPath();
            ctx.moveTo(headX, headY + 40);
            ctx.lineTo(headX - 30, headY + 20);
            ctx.stroke();
        }

        if (errors >= 4) {
            // Right arm
            ctx.beginPath();
            ctx.moveTo(headX, headY + 40);
            ctx.lineTo(headX + 30, headY + 20);
            ctx.stroke();
        }

        if (errors >= 5) {
            // Left leg
            ctx.beginPath();
            ctx.moveTo(headX, headY + 80);
            ctx.lineTo(headX - 25, headY + 120);
            ctx.stroke();
        }

        if (errors >= 6) {
            // Right leg
            ctx.beginPath();
            ctx.moveTo(headX, headY + 80);
            ctx.lineTo(headX + 25, headY + 120);
            ctx.stroke();

            // Sad face
            ctx.beginPath();
            ctx.arc(headX - 8, headY - 5, 3, 0, Math.PI * 2); // Left eye
            ctx.arc(headX + 8, headY - 5, 3, 0, Math.PI * 2); // Right eye
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(headX, headY + 5, 8, 0.2 * Math.PI, 0.8 * Math.PI); // Sad mouth
            ctx.stroke();
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }
}

global.hangmanGames = global.hangmanGames || {};
let cooldowns = {};

let handler = async (m, { conn, usedPrefix, text }) => {
    const chat = m.chat;
    const userId = m.sender;
    const user = global.db.data.users[userId];

    if (!user) return conn.reply(m.chat, '❌ User not found in database!', m);

    // Command handling
    const args = text.trim().split(' ');
    const command = args[0]?.toUpperCase();

    if (!global.hangmanGames[userId]) {
        global.hangmanGames[userId] = new HangmanGame(userId, user);
    }

    const game = global.hangmanGames[userId];

    if (command === 'START' || command === 'BEGIN') {
        const betAmount = parseInt(args[1]) || 100;
        
        if (cooldowns[userId] && Date.now() - cooldowns[userId] < 5000) {
            const remaining = Math.ceil((cooldowns[userId] + 5000 - Date.now()) / 1000);
            return conn.reply(m.chat, `⏰ Wait ${remaining} seconds before starting a new game!`, m);
        }

        const result = game.startGame(betAmount);
        if (result.error) return conn.reply(m.chat, result.error, m);

        cooldowns[userId] = Date.now();

        const image = await game.generateHangmanImage();
        const caption = `🎯 *HANGMAN - GAME STARTED!*\n\n` +
                       `📏 Word of ${result.wordLength} letters\n` +
                       `💶 Bet: ${game.formatNumber(betAmount)} UC\n` +
                       `❤️ Attempts: ${result.attempts}\n\n` +
                       `💡 Send me a letter to guess!\n` +
                       `⚡ Example: ${usedPrefix}hangman A`;

        await conn.sendMessage(chat, {
            image: image,
            caption: caption,
            footer: 'Hangman 🎯'
        }, { quoted: m });

    } else if (/^[A-Z]$/i.test(command)) {
        // Guess a letter
        if (game.gameState !== 'playing') {
            return conn.reply(m.chat, '❌ No game in progress! Use .hangman start', m);
        }

        const result = game.guessLetter(command);
        if (result.error) return conn.reply(m.chat, result.error, m);

        const image = await game.generateHangmanImage();
        let caption = `🎯 *HANGMAN*\n\n`;

        if (result.won) {
            caption += `🎉 *YOU WON!*\n` +
                      `💰 Prize: ${game.formatNumber(result.prize)} UC\n` +
                      `✨ Multiplier: x${game.prizeMultiplier.toFixed(1)}\n` +
                      `🏆 Word: ${game.currentWord}`;
        } else if (result.lost) {
            caption += `💀 *YOU LOST!*\n` +
                      `📝 Word: ${result.word}\n` +
                      `😔 Try again!`;
        } else {
            caption += `📝 ${game.getDisplayWord()}\n` +
                      `❤️ Attempts: ${game.attemptsLeft}/${game.maxAttempts}\n` +
                      `❌ Errors: ${game.wrongLetters.join(', ') || 'None'}\n\n` +
                      `💡 ${result.correct ? '✅ Correct letter!' : '❌ Wrong letter!'}`;
        }

        caption += `\n💶 Bet: ${game.formatNumber(game.betAmount)} UC`;

        const buttons = [
            { buttonId: `${usedPrefix}hangman start 100`, buttonText: { displayText: "🎯 New Game" }, type: 1 }
        ];

        await conn.sendMessage(chat, {
            image: image,
            caption: caption,
            footer: 'Hangman 🎯',
            buttons: game.gameState !== 'playing' ? buttons : undefined
        }, { quoted: m });

    } else if (command === 'REVEAL' || command === 'GIVEUP') {
        if (game.gameState !== 'playing') {
            return conn.reply(m.chat, '❌ No game in progress!', m);
        }

        game.gameState = 'lost';
        const image = await game.generateHangmanImage();
        
        const caption = `🎯 *HANGMAN - GAME ENDED*\n\n` +
                       `💀 You gave up!\n` +
                       `📝 The word was: ${game.currentWord}\n` +
                       `💶 Lost bet: ${game.formatNumber(game.betAmount)} UC`;

        const buttons = [
            { buttonId: `${usedPrefix}hangman start 100`, buttonText: { displayText: "🎯 New Game" }, type: 1 }
        ];

        await conn.sendMessage(chat, {
            image: image,
            caption: caption,
            footer: 'Hangman 🎯',
            buttons: buttons
        }, { quoted: m });

    } else {
        // Help
        const helpText = `🎯 *HANGMAN - COMMANDS*\n\n` +
                        `🔄 ${usedPrefix}hangman start [bet] - Start new game\n` +
                        `🔤 ${usedPrefix}hangman [letter] - Guess a letter\n` +
                        `🏳️ ${usedPrefix}hangman reveal - Give up game\n\n` +
                        `💡 Examples:\n` +
                        `${usedPrefix}hangman start 500\n` +
                        `${usedPrefix}hangman A\n` +
                        `${usedPrefix}hangman reveal`;

        await conn.sendMessage(chat, {
            text: helpText,
            footer: 'Hangman 🎯'
        }, { quoted: m });
    }
};

handler.help = ['hangman [start/letter/reveal]'];
handler.tags = ['games'];
handler.command = /^hangman$/i;
handler.group = true;
handler.register = true;

export default handler;
