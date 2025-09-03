let handler = async (m) => {
    let totalFunctions = Object.values(global.plugins).filter(v => v.command).length;
    let num1 = ['𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗'];
    let num2 = totalFunctions.toString().split('').map(digit => num1[digit]).join('');
    m.reply(`ⓘ The bot has ${num2} functions.`);
}

handler.command = ['totalfunctions', 'functions'];
export default handler;