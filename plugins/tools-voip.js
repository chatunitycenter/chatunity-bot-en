import axios from 'axios';

// Handler to get temporary numbers
const tempNumHandler = async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args || args.length < 1) {
            return reply(`❌ *Usage:* .tempnum <country-code>\nExample: .tempnum us

📦 Use .otpbox <number> to check OTPs`);
        }

        const countryCode = args[0].toLowerCase();
        
        // API call to get the list of temporary numbers for the country code
        const { data } = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/listnumber?id=${countryCode}`,
            { 
                timeout: 10000,
                validateStatus: status => status === 200
            }
        );

        if (!data?.result || !Array.isArray(data.result)) {
            return reply(`⚠ Invalid API response format
Try .tempnum us`);
        }

        if (data.result.length === 0) {
            return reply(`📭 No available numbers for *${countryCode.toUpperCase()}*\nTry another country code!\n
Use .otpbox <number> after selecting`);
        }

        const numbers = data.result.slice(0, 25);
        const numberList = numbers.map((num, i) => 
            `${String(i+1).padStart(2, ' ')}. ${num.number}`
        ).join("\n");

        // Response with the list of temporary numbers
        await reply(
            `╭──「 📱 TEMPORARY NUMBERS 」\n` +
            `│\n` +
            `│ Country: ${countryCode.toUpperCase()}\n` +
            `│ Numbers Found: ${numbers.length}\n` +
            `│\n` +
            `${numberList}\n
` +
            `╰──「 📦 USE: .otpbox <number> 」\n` +
            `_Example: .otpbox +1234567890_`
        );

    } catch (err) {
        // Error handling
        const errorMessage = err.code === "ECONNABORTED" ? 
            `⏳ *Timeout*: The API took too long
Try smaller country codes like 'us', 'uk'` :
            `⚠ *Error*: ${err.message}\nFormat: .tempnum <country-code>`;
            
        reply(`${errorMessage}\n
🔑 Remember: .otpbox <number>`);
    }
};

// Handler to get the list of available countries
const tempListHandler = async (conn, m, { reply }) => {
    try {
        const { data } = await axios.get("https://api.vreden.my.id/api/tools/fakenumber/country");

        if (!data || !data.result) return reply("❌ Unable to retrieve the list of countries.");

        const countries = data.result.map((c, i) => `*${i + 1}.* ${c.title} \`(${c.id})\``).join("\n");

        // Response with the list of countries
        await reply(`🌍 *Available Countries:* ${data.result.length}\n
${countries}`);
    } catch (e) {
        reply("❌ Error retrieving the list of countries for temporary numbers.");
    }
};

// Handler to check OTP messages for a number
const otpBoxHandler = async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0] || !args[0].startsWith("+")) {
            return reply(`❌ *Usage:* .otpbox <full-number>\nExample: .otpbox +1234567890`);
        }

        const phoneNumber = args[0].trim();
        
        // API call to get OTP messages for the number
        const { data } = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/message?nomor=${encodeURIComponent(phoneNumber)}`,
            { 
                timeout: 10000,
                validateStatus: status => status === 200
            }
        );

        if (!data?.result || !Array.isArray(data.result)) {
            return reply("⚠ No OTP messages found for this number");
        }

        const otpMessages = data.result.map(msg => {
            const otpMatch = msg.content.match(/\b\d{4,8}\b/g);
            const otpCode = otpMatch ? otpMatch[0] : "Not found";
            
            return `┌ *From:* ${msg.from || "Unknown"}
│ *Code:* ${otpCode}
│ *Time:* ${msg.time_wib || msg.timestamp}
└ *Message:* ${msg.content.substring(0, 50)}${msg.content.length > 50 ? "..." : ""}`;
        }).join("\n
");

        // Response with OTP messages found
        await reply(
            `╭──「 🔑 OTP MESSAGES 」\n` +
            `│ Number: ${phoneNumber}\n` +
            `│ Messages found: ${data.result.length}\n` +
            `│\n` +
            `${otpMessages}\n` +
            `╰──「 📌 Use .tempnum to get numbers 」`
        );

    } catch (err) {
        // Error handling
        const errorMsg = err.code === "ECONNABORTED" ?
            "⌛ Timeout while checking OTP. Please try again later" :
            `⚠ Error: ${err.response?.data?.error || err.message}`;
        
        reply(`${errorMsg}\n
Usage: .otpbox +1234567890`);
    }
};

// Main handler managing all commands
export const handler = async (m, conn, { command, args, reply }) => {
    switch(command) {
        case 'tempnum':
        case 'fakenum':
        case 'tempnumber':
            return tempNumHandler(conn, m, { args, reply });
            
        case 'templist':
        case 'tempnumberlist':
        case 'tempnlist':
        case 'listnumbers':
            return tempListHandler(conn, m, { reply });
            
        case 'otpbox':
        case 'checkotp':
        case 'getotp':
            return otpBoxHandler(conn, m, { args, reply });
            
        default:
            // Unknown command
            break;
    }
};
