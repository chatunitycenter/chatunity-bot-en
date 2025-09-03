
//edited by filo222
const friendRequests = {};

let handler = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    switch (command) {
        case 'friend':
            await handleFriendRequest(m, user, users, text, usedPrefix, conn);
            break;
        case 'removefriend':
            handleRemoveFriend(m, user, users);
            break;
    }
};

const handleFriendRequest = async (m, user, users, text, usedPrefix, conn) => {
    let mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!mention) throw `⚠️ Tag the person you want to send a friend request to!\nExample: ${usedPrefix}friend @tag`;

    if (mention === m.sender) throw '❌ I understand you love yourself but you cannot add yourself as a friend!';

    let recipient = users[mention];
    if (!recipient) throw '🚫 Person not found in the system';

    if (user.friends && user.friends.includes(mention)) {
        let text = `✅ @${mention.split('@')[0]} is already in your friends list.`;
        m.reply(text, null, { mentions: [mention] });
        return;
    }

    if (friendRequests[m.sender] || friendRequests[mention]) throw `⚠️ A friend request is already pending. Wait for a response or cancellation.`;

    friendRequests[mention] = { from: m.sender, timeout: null };
    friendRequests[m.sender] = { to: mention, timeout: null };
    
 let text = `👥 Friend request pending...\n\n@${mention.split('@')[0]}, do you want to accept @${m.sender.split('@')[0]}'s friend request?\n\n> ⏳ You have 60 seconds to decide.`;

const buttons = [
  { buttonId: 'accept', buttonText: { displayText: '✅ Accept' }, type: 1 },
  { buttonId: 'reject', buttonText: { displayText: '❌ Reject' }, type: 1 },
  { buttonId: 'removefriend', buttonText: { displayText: '🚫 Remove friend' }, type: 1 }
];

await conn.sendMessage(m.chat, {
  text: text,
  buttons,
  mentions: [mention, m.sender],
  headerType: 1
}, { quoted: m });

    let timeoutCallback = () => {
        if (friendRequests[mention]) {
            let cancellation = `⏳ Friend request cancelled\n> @${m.sender.split('@')[0]} and @${mention.split('@')[0]} didn't respond in time.`;
            conn.sendMessage(m.chat, { text: cancellation, mentions: [m.sender, mention] });
            delete friendRequests[mention];
            delete friendRequests[m.sender];
        }
    };

    friendRequests[mention].timeout = setTimeout(timeoutCallback, 60000); 
    friendRequests[m.sender].timeout = friendRequests[mention].timeout;
};

handler.before = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    if (!(m.sender in friendRequests)) return null;

if (!m.message || !m.message.buttonsResponseMessage) return;
let response = m.message.buttonsResponseMessage.selectedButtonId;
let sender = m.sender;

    let user = friendRequests[m.sender];
    if (!user) return;

    clearTimeout(user.timeout);

    if (response === 'reject') {
        let fromUser = friendRequests[m.sender].from || m.sender;
        delete friendRequests[fromUser];
        delete friendRequests[m.sender];
        return m.reply(`❌ Friend request rejected.`, null, { mentions: [fromUser] });
    }

    if (response === 'accept') {
        let fromUser = friendRequests[m.sender].from;
        let toUser = m.sender;

        let senderUser = global.db.data.users[fromUser];
        let receiverUser = global.db.data.users[toUser];

        if (!Array.isArray(senderUser.friends)) senderUser.friends = [];
        if (!Array.isArray(receiverUser.friends)) receiverUser.friends = [];

        senderUser.friends.push(toUser);
        receiverUser.friends.push(fromUser);
        
         let text = `👥 You and @${fromUser.split('@')[0]} are now friends!`;
        m.reply(text, null, { mentions: [fromUser] });

        delete friendRequests[fromUser];
        delete friendRequests[toUser];
    }
};

const handleRemoveFriend = (m, user, users) => {
    let mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!mention) throw '⚠️ Tag the person you want to remove from your friends.';

    if (!user.friends || !user.friends.includes(mention)) throw `🚫 @${mention.split('@')[0]} is not in your friends list.`;

    user.friends = user.friends.filter(friend => friend !== mention);
    let friend = users[mention];
    if (friend) {
        friend.friends = friend.friends.filter(friend => friend !== m.sender);
    }

    let text = `🚫 You and @${mention.split('@')[0]} are no longer friends.`;
    m.reply(text, null, { mentions: [mention] });
};

handler.command = ['friend', 'removefriend'];

export default handler;
