const message = `
✨ *ZODIAC PROFILE* ✨

📆 *Date of birth:* ${birth.join('-')}
🔄 *Next birthday:* ${nextBirthday.join('-')}
🧮 *Current age:* ${ageCheck}
🌟 *Zodiac sign:* ${zodiacSign} ${signEmoji}

📜 *Characteristic:* ${signDescription}

${getRandomHoroscope(zodiacSign)}
`;
