let handler = async (m, { conn, text }) => {
    let target;

    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } 
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } 
    else {
        return m.reply("Tag someone or reply to a message to rizz them up.");
    }

    m.reply("@" + target.split('@')[0] + ' "' + pickRandom(global.rizz) + '"', null, { mentions: [target] });
}

handler.tags = ['fun'];
handler.command = handler.help = ['rizz'];

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

global.rizz = [
    "If your body were a prison and your lips were chains, what a beautiful place to serve my sentence.",
    "So many stars in space, but none shine like you.",
    "I like coffee, but I’d rather have you-tea.",
    "You’re not Google, but you have everything I’m looking for.",
    "Here’s a flower for you, though none will ever be as beautiful as you.",
    "If every drop of water on your body were a kiss, I’d want to become a thunderstorm.",
    "There’s no life in my life, no light in my life, there’s someone missing — and that someone is you.",
    "You're so beautiful I'd give you a million kisses, and if you didn’t like them, I’d take them all back.",
    "If you were winter rain, I’d close my umbrella just to feel you on my skin.",
    "These aren't golden or ruby words, just words of affection composed for you.",
    "When you walk, you don’t step on the ground — you caress it.",
    "So many forms of life, and I only live in your eyes.",
    "I like you so much, I don’t even know where to begin.",
    "Everyone stops at your body, but I prefer your heart.",
    "Your beauty blinds me — because it comes from your heart and reflects in your eyes.",
    "If someone told you you’re beautiful, they lied. You’re not beautiful — you’re stunning.",
    "Sky is blue, cream is yellow, and black are the eyes of the girl who’s killing me.",
    "If I were Columbus, I’d sail day and night to reach the depths of your heart.",
    "If beauty were time, you’d be 24 hours.",
    "If loving you is a sin, I’ve got hell guaranteed.",
    "You’re the only thing missing from my life to make it perfect.",
    "No fancy words, just a sincere verse: my love for you is infinite and my heart is true.",
    "What I feel for you is so immense, I’d need another universe to contain it.",
    "Math always tells the truth: you + me = forever.",
    "At night the moon shines, during the day the sun — but your eyes light up my heart.",
    "Don’t look for me — I’d rather stay lost in your gaze.",
    "Some want the world, others the sun. I just want a corner of your heart.",
    "If I were an astronaut I’d take you to Pluto, but since I’m not — I’ll keep you in my heart.",
    "They say Disneyland is the happiest place on Earth. But have they ever been next to you?",
    "I bet your name is Google. Why? Because you have everything I’ve been searching for!",
    "Do you have a pencil and an eraser? Because I want to erase your past and write our future.",
    "You’re like my favorite cup of coffee — warm and lip-smacking good!",
    "I want our love to be like Pi: irrational and infinite.",
    "I’m writing a book about the best things in life — and you’re on the first page.",
    "I wasn’t always religious. But I am now, because you're the answer to my prayers.",
    "Just imagine: wouldn’t we look cute on top of a wedding cake?",
    "You’re the kind of girl my mom would want me to bring home. Wanna meet her?",
    "Your face is perfect... God really outdid himself with you."
];
