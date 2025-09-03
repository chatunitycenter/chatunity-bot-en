import fetch from 'node-fetch';
import fs from 'fs';

function sort(property, ascending = true) {
    return property ? 
        (a, b) => ascending ? a[property] - b[property] : b[property] - a[property] : 
        (a, b) => ascending ? a - b : b - a;
}

function getMedal(position) {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈'; 
    if (position === 3) return '🥉';
    return '🏅';
}

const handler = async (message, {conn: connection, args: arguments, participants: participants}) => {
    const requiredFiles = [
        './termini.jpeg',
        './plugins/OWNER_file.js', 
        './CODE_OF_CONDUCT.md',
        './bal.png'
    ];
    
    const missingFiles = requiredFiles.find(file => !fs.existsSync(file));
    if (missingFiles) {
        return await connection.sendMessage(message.chat, { 
            'text': '❗ To use this command use the chatunity base' 
        }, { 'quoted': message });
    }
    
    if (!message.isGroup) {
        return await message.reply('This command only works in groups!');
    }
    
    let userCount = 10;
    if (arguments[0]) {
        let parsedCount = parseInt(arguments[0]);
        if (!isNaN(parsedCount) && parsedCount >= 1 && parsedCount <= 100 && (parsedCount % 5) === 0) {
            userCount = parsedCount;
        }
    }
    
    let userData = participants.filter(participant => participant.id !== connection.user.jid)
        .map(participant => {
            let userInfo = global.db.data.users[participant.id] || {};
            return {
                'jid': participant.id,
                'messages': userInfo.messages || 0,
                'userData': userInfo
            };
        });
    
    let sortedUsers = userData.sort(sort('messages', false));
    let topUsers = sortedUsers.slice(0, userCount);
    
    let userCards = await Promise.all(topUsers.map(async ({jid: userId, messages: messageCount, userData: userInfo}, index) => {
        let medal = getMedal(index + 1);
        let userName;
        
        try {
            userName = await connection.getName(userId);
        } catch {
            userName = userId.split('@')[0];
        }
        
        let profilePicture;
        try {
            profilePicture = await connection.profilePictureUrl(userId, 'image');
        } catch {
            profilePicture = 'https://qu.ax/LoGxD.png';
        }
        
        let userRole = 'Member 🤍';
        try {
            let groupInfo = await connection.groupMetadata(message.chat);
            let participant = groupInfo.participants.find(p => p.id === userId);
            
            if (participant) {
                if (participant.admin === 'superadmin' || participant.admin === 'admin') {
                    userRole = 'Admin 👑';
                }
                if (groupInfo.owner === userId) {
                    userRole = 'Founder ⚜';
                }
            }
        } catch {}
        
        const levelNames = [
            'Member 🤍',
            'Beginner I 😐',
            'Beginner II 😐', 
            'Recruit I 🙂',
            'Recruit II 🙂',
            'Advanced I 🫡',
            'Advanced II 🫡',
            'Pro I 😤',
            'Pro II 😤',
            'Master I 💪🏼',
            'Master II 💪🏼',
            'Bomber I 😎',
            'Bomber II 😎',
            'Mythic I 🔥',
            'Mythic II 🔥',
            'Champion I 🏆',
            'Champion II 🏆',
            'Hero I 🎖',
            'Hero II 🎖',
            'Elite I 🤩',
            'Elite II 🤩',
            'Legend I ⭐',
            'Legend II ⭐',
            'Dominator I 🥶',
            'Dominator II 🥶',
            'Stellar I 💫',
            'Stellar II 💫',
            'Cosmic I 🔮',
            'Cosmic II 🔮',
            'Titan I 😈',
            'Titan II 😈',
            'Out of Class ❤‍🔥'
        ];
        
        const levelIndex = Math.floor(messageCount / 382);
        const userLevel = levelIndex >= 30 ? 'Out of Class ❤‍🔥' : levelNames[levelIndex] || '-';
        
        let genderIcon = '🚻';
        if (userInfo.gender === 'male') {
            genderIcon = '🚹';
        } else if (userInfo.gender === 'female') {
            genderIcon = '🚺';
        }
        
        let instagramInfo = userInfo.instagram ? 
            '🌐 instagram.com/' + userInfo.instagram : 
            '🌐 Instagram: not set';
        
        let cardBody = medal + ' ' + userName + '\n' +
            '📝 Messages: ' + messageCount + '\n' +
            '🟣 Role: ' + userRole + '\n' +
            '🏅 Level: ' + userLevel + '\n' +
            '🚻 Gender: ' + genderIcon + '\n' +
            '' + instagramInfo;
        
        return {
            'image': { 'url': profilePicture },
            'title': '#' + (index + 1),
            'body': cardBody,
            'footer': 'Top messages ' + userCount + ' users'
        };
    }));
    
    await connection.sendMessage(message.chat, {
        'title': '🏆 Top ' + userCount + ' users by messages',
        'text': 'See who rocks the most in the group! 🏅',
        'footer': 'Use .info @mention for more information about each user',
        'cards': userCards
    }, { 'quoted': message });
};

handler.command = ['topmessages'];
handler.group = true;
handler.admin = false;

export default handler;