// Plugins By Gabs
import { tmpdir } from 'os';
import path, { join } from 'path';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import fs from 'fs'

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

function jaccardSimilarity(str1, str2) {
  const set1 = new Set(str1.split(''));
  const set2 = new Set(str2.split(''));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function longestCommonSubsequence(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

function normalizeString(str) {
  return str.toLowerCase()
    .replace(/[_\-\s\.]/g, '')
    .replace(/[àáâãäåæ]/g, 'a')
    .replace(/[èéêëē]/g, 'e')
    .replace(/[ìíîïī]/g, 'i')
    .replace(/[òóôõöøō]/g, 'o')
    .replace(/[ùúûüū]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[ý]/g, 'y')
    .replace(/[ß]/g, 's')
    .replace(/[đ]/g, 'd')
    .replace(/[ł]/g, 'l')
    .replace(/[ř]/g, 'r')
    .replace(/[š]/g, 's')
    .replace(/[ž]/g, 'z')
    .replace(/[0-9]/g, '');
}

function calculateAdvancedSimilarity(input, filename) {
  const normalizedInput = normalizeString(input);
  const normalizedFile = normalizeString(filename.replace('.js', ''));
  
  if (normalizedInput === normalizedFile) return 1.0;
  if (normalizedInput.length === 0 || normalizedFile.length === 0) return 0;
  
  const exactMatch = normalizedInput === normalizedFile;
  const containsMatch = normalizedFile.includes(normalizedInput) || normalizedInput.includes(normalizedFile);
  const startsWithMatch = normalizedFile.startsWith(normalizedInput) || normalizedInput.startsWith(normalizedFile);
  const endsWithMatch = normalizedFile.endsWith(normalizedInput) || normalizedInput.endsWith(normalizedFile);
  
  const distance = levenshteinDistance(normalizedInput, normalizedFile);
  const maxLength = Math.max(normalizedInput.length, normalizedFile.length);
  const levenshteinSimilarity = 1 - (distance / maxLength);
  
  const jaccardScore = jaccardSimilarity(normalizedInput, normalizedFile);
  
  const lcsLength = longestCommonSubsequence(normalizedInput, normalizedFile);
  const lcsScore = (2 * lcsLength) / (normalizedInput.length + normalizedFile.length);
  
  let nGramScore = 0;
  const nGramSize = Math.min(2, Math.min(normalizedInput.length, normalizedFile.length));
  if (nGramSize > 0) {
    const inputNGrams = new Set();
    const fileNGrams = new Set();
    
    for (let i = 0; i <= normalizedInput.length - nGramSize; i++) {
      inputNGrams.add(normalizedInput.substr(i, nGramSize));
    }
    
    for (let i = 0; i <= normalizedFile.length - nGramSize; i++) {
      fileNGrams.add(normalizedFile.substr(i, nGramSize));
    }
    
    const intersection = new Set([...inputNGrams].filter(x => fileNGrams.has(x)));
    const union = new Set([...inputNGrams, ...fileNGrams]);
    nGramScore = intersection.size / union.size;
  }
  
  let positionScore = 0;
  for (let i = 0; i < Math.min(normalizedInput.length, normalizedFile.length); i++) {
    if (normalizedInput[i] === normalizedFile[i]) {
      positionScore += (1 / Math.max(normalizedInput.length, normalizedFile.length));
    }
  }
  
  let score = 0;
  if (exactMatch) score = 1.0;
  else if (startsWithMatch) score = 0.95;
  else if (endsWithMatch) score = 0.9;
  else if (containsMatch) score = 0.85;
  else {
    const weights = {
      levenshtein: 0.3,
      jaccard: 0.25,
      lcs: 0.2,
      nGram: 0.15,
      position: 0.1
    };
    
    score = (levenshteinSimilarity * weights.levenshtein) +
            (jaccardScore * weights.jaccard) +
            (lcsScore * weights.lcs) +
            (nGramScore * weights.nGram) +
            (positionScore * weights.position);
  }
  
  const lengthPenalty = Math.abs(normalizedInput.length - normalizedFile.length) / Math.max(normalizedInput.length, normalizedFile.length);
  score *= (1 - lengthPenalty * 0.1);
  
  return Math.max(0, Math.min(1, score));
}

function findBestMatches(input, allFiles, threshold = 0.2, maxResults = 5) {
  const results = allFiles.map(file => {
    const filename = file.replace('.js', '');
    const score = calculateAdvancedSimilarity(input, filename);
    return { file, filename, score };
  });
  
  const filtered = results.filter(item => item.score >= threshold);
  const sorted = filtered.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.01) {
      return a.filename.length - b.filename.length;
    }
    return b.score - a.score;
  });
  
  return sorted.slice(0, maxResults);
}

let handler = async (m, { text, usedPrefix, command, __dirname, conn }) => {
  const availablePlugins = Object.keys(plugins);
  const pluginNames = availablePlugins.map(plugin => plugin.replace('.js', ''));
  
  if (!text) {
    const helpMessage = `
╭━━━━━『 🗑️ PLUGIN DELETE 』━━━━━╮
┃
┃ 📌 *Command usage:*
┃ \`${usedPrefix}deleteplugin <name>\`
┃
┃ ✨ *Example:*
┃ \`${usedPrefix}deleteplugin main-menu\`
┃
┃ 📋 *Available plugins:*
${pluginNames.slice(0, 15).map((name, i) => `┃ ${i + 1}. ${name}`).join('\n')}
${pluginNames.length > 15 ? `┃ ... and ${pluginNames.length - 15} more plugins` : ''}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
    `.trim();
    
    if (global.deletePluginData) {
      delete global.deletePluginData;
    }
    
    const info = `📁 *Plugin Manager*\n\n${helpMessage}\n\n❓ Select a plugin to delete:`
    
    return conn.reply(m.chat, info, m);
  }

  const input = text.trim();
  let targetPlugin;
  
  if (/^\d+$/.test(input)) {
    const index = parseInt(input) - 1;
    if (index >= 0 && index < pluginNames.length) {
      targetPlugin = pluginNames[index];
    } else {
      throw `❌ Invalid number! Range: 1-${pluginNames.length}`;
    }
  } else {
    const exactMatch = pluginNames.find(name => name === input);
    if (exactMatch) {
      targetPlugin = exactMatch;
    } else {
      let allFiles;
      try {
        allFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
      } catch {
        allFiles = fs.readdirSync('plugins').filter(file => file.endsWith('.js'));
      }
      
      const matches = findBestMatches(input, allFiles);
      
      if (matches.length === 0) {
        throw `❌ No plugin similar to "${input}" found`;
      }
      
      if (matches.length === 1 && matches[0].score > 0.7) {
        global.deletePluginData = {
          chat: m.chat,
          filename: matches[0].file,
          sender: m.sender,
          dirname: __dirname,
          autoConfirm: true
        };

        return m.reply(`✨ Found "${matches[0].filename}" (${Math.round(matches[0].score * 100)}%)\n🗑️ Do you want to delete it?\n\n📝 yes/no`);
      }

      global.deletePluginData = {
        chat: m.chat,
        options: matches,
        sender: m.sender,
        dirname: __dirname,
        isMultipleChoice: true
      };

      const optionsText = matches.map((item, index) => 
        `${index + 1}. ${item.filename} (${Math.round(item.score * 100)}%)`
      ).join('\n');

      return m.reply(`🔍 Results for "${input}":\n\n${optionsText}\n\n📝 Select a number or "no" to cancel`);
    }
  }

  await deletePlugin(targetPlugin, __dirname, m, conn);
}

async function deletePlugin(pluginName, __dirname, m, conn) {
  try {
    const pluginPath = join(__dirname, '../plugins/' + pluginName + '.js');
    
    if (!existsSync(pluginPath)) {
      return conn.reply(m.chat, `
╭━━━━━『 ⚠️ WARNING 』━━━━━╮
┃
┃ 📁 *File not found in filesystem*
┃
┃ 🔍 *Path searched:*
┃ \`${pluginPath}\`
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
      `.trim(), m);
    }
    
    unlinkSync(pluginPath);
    
    const successMessage = `
╭━━━━━『 ✅ PLUGIN DELETED 』━━━━━╮
┃
┃ 🗑️ *Plugin deleted successfully!*
┃
┃ 📝 *Name:* \`${pluginName}.js\`
┃ 👤 *Deleted by:* @${m.sender.split('@')[0]}
┃ 🕐 *Time:* ${new Date().toLocaleString('en-US')}
┃
┃ ⚠️ *Note:* The bot may require
┃ a restart to apply changes
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🎯 *Operation completed!*
    `.trim();
    
    const fakeMessage = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'PluginDeleted'
      },
      message: {
        locationMessage: {
          name: '🗑️ Plugin Successfully Deleted',
          jpegThumbnail: await (await fetch('https://telegra.ph/file/6d491d5823b5778921229.png')).buffer(),
          vcard: `BEGIN:VCARD
VERSION:3.0
N:;Plugin Manager;;;
FN:Plugin Manager
ORG:Bot System
TITLE:Plugin Deletion Service
item1.TEL;waid=0000000000:+0 (000) 000-0000
item1.X-ABLabel:Plugin Manager
X-WA-BIZ-DESCRIPTION:Plugin Management System
X-WA-BIZ-NAME:Bot Plugin Manager
END:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };
    
    await conn.reply(m.chat, successMessage, fakeMessage, { 
      mentions: [m.sender] 
    });
    
  } catch (error) {
    console.error('Error deleting plugin:', error);
    
    const errorMessage = `
╭━━━━━『 💥 SYSTEM ERROR 』━━━━━╮
┃
┃ ❌ *Unable to delete plugin*
┃
┃ 🔍 *Error details:*
┃ \`${error.message}\`
┃
┃ 💡 *Possible solutions:*
┃ • Check file permissions
┃ • Verify plugin is not in use
┃ • Try again in a few seconds
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
    `.trim();
    
    return conn.reply(m.chat, errorMessage, m);
  }
}

handler.before = async (m, { conn }) => {
  if (!global.deletePluginData) return;
  if (m.chat !== global.deletePluginData.chat) return;
  if (m.sender !== global.deletePluginData.sender) return;
  
  const response = m.text.toLowerCase().trim();
  
  if (global.deletePluginData.isMultipleChoice) {
    const choice = parseInt(response);
    if (choice >= 1 && choice <= global.deletePluginData.options.length) {
      const selectedFile = global.deletePluginData.options[choice - 1];
      
      try {
        await deletePlugin(selectedFile.filename, global.deletePluginData.dirname, m, conn);
        delete global.deletePluginData;
        return true;
      } catch (error) {
        m.reply(`❌ Error: ${error.message}`);
        delete global.deletePluginData;
        return true;
      }
    }
    
    if (response === 'no') {
      m.reply('❌ Operation cancelled');
      delete global.deletePluginData;
      return true;
    }
    
    return;
  }
  
  if (response === 'yes' || response === 'y') {
    try {
      const pluginName = global.deletePluginData.filename.replace('.js', '');
      await deletePlugin(pluginName, global.deletePluginData.dirname, m, conn);
      delete global.deletePluginData;
      return true;
    } catch (error) {
      m.reply(`❌ Error: ${error.message}`);
      delete global.deletePluginData;
      return true;
    }
  }
  
  if (response === 'no') {
    m.reply('❌ Operation cancelled');
    delete global.deletePluginData;
    return true;
  }
};

handler.help = ['deleteplugin'];
handler.tags = ['owner'];
handler.command = /^(deleteplugin|dp|deleteplu|removeplugin|deleteplugin)$/i;
handler.owner = true;

export default handler;
