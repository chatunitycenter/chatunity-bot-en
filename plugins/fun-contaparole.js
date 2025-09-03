let handler = async (m, { text }) => {
    let txt = text || (m.quoted && m.quoted.text);
    
    if (!txt) {
        throw '> ⓘ Please provide text to count.';
    }
    
    const specialCharacters = /[^\w\d\s]/.test(txt);
    if (specialCharacters) {
        throw '> ⚠️ The inserted text contains special characters.';
    }
    
    const words = txt.match(/\b\w+\b/g);
    
    const wordCount = words ? words.length : 0;
    
    const numberCount = txt.match(/\b\d+\b/g) ? txt.match(/\b\d+\b/g).length : 0;
    
    const specialNumbers = ['𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗'];
    const formattedWordCount = wordCount.toString().split('').map(digit => specialNumbers[digit]).join('');
    
    const formattedNumberCount = numberCount.toString().split('').map(digit => specialNumbers[digit]).join('');
    
    let message = ` ⓘ The inserted text contains ${formattedWordCount} words`;
    
    if (numberCount > 0) {
        message += ` and ${formattedNumberCount} numbers`;
    }
    
    if (numberCount === 0) {
        message += `.`;
    }
    
    m.reply(message);
}

handler.command = ['countwords'];
export default handler;
