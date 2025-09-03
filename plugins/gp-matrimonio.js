let fromUser = proposals[m.sender].from;
let toUser = m.sender;

// Check that both users exist in the database
let senderUser = global.db.data.users[fromUser];
let receiverUser = global.db.data.users[toUser];
if (!senderUser || !receiverUser) {
    delete proposals[fromUser];
    delete proposals[toUser];
    return m.reply('❌ One of the users is no longer in the database.');
}

senderUser.married = true;
senderUser.spouse = toUser;
senderUser.firstMarriage = true;
receiverUser.married = true;
receiverUser.spouse = fromUser;
receiverUser.firstMarriage = true;

let text = `💍 I hereby declare @${m.sender.split('@')[0]} and @${fromUser.split('@')[0]} officially married until the connection do you part.`;
await m.reply(text, null, { mentions: [m.sender, fromUser] });

delete proposals[fromUser];
delete proposals[toUser];
const handleDivorce = (m, user, users) => {
    if (!user.married) throw '💔 You must be married first before you can divorce.';

    let ex = users[user.spouse];
    if (!ex) throw 'Spouse not found in the system.';

    if (!Array.isArray(user.ex)) user.ex = [];
    if (!user.ex.includes(user.spouse)) user.ex.push(user.spouse);

    if (!Array.isArray(ex.ex)) ex.ex = [];
    if (!ex.ex.includes(m.sender)) ex.ex.push(m.sender);

    user.married = false;
    let exSpouse = user.spouse; // Save spouse before deleting
    user.spouse = '';
    ex.married = false;
    ex.spouse = '';

    let text = `💔 You and @${exSpouse?.split('@')[0] || 'unknown'} are now divorced.\n\nHonestly, you were a terrible couple.`;
    m.reply(text, null, { mentions: exSpouse ? [exSpouse] : [] });
};
handler.group = true;
handler.command = ['marry', 'divorce'];
export default handler;
