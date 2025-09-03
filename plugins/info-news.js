const sourcesBySport = {
    'calcio': [
        {
            'name': 'Gazzetta',
            'url': 'https://www.gazzetta.it/rss/Calcio.xml'
        },
        {
            'name': 'Corriere dello Sport',
            'url': 'https://www.corrieredellosport.it/rss/calcio'
        },
        {
            'name': 'Tuttosport',
            'url': 'https://www.tuttosport.com/rss/calcio.xml'
        }
    ],
    'basket': [{
        'name': 'Sky Basket',
        'url': 'https://www.sportando.basketball/feed/'
    }],
    'tennis': [{
        'name': 'Ubitennis',
        'url': 'https://www.ubitennis.com/feed/'
    }],
    'formula1': [{
        'name': 'FormulaPassion',
        'url': 'https://formulapassion.it/feed'
    }],
    'mma': [{
        'name': 'MMA Mania',
        'url': 'https://www.mmamania.com/rss/current.xml'
    }],
    'ciclismo': [{
        'name': 'CyclingNews',
        'url': 'https://www.cyclingnews.com/rss/news/'
    }]
};

async function getNews(sport = 'calcio') {
    let articles = [];
    const sources = sourcesBySport[sport] || [];
    
    for (const source of sources) {
        try {
            const response = await fetch(source.url);
            const xmlText = await response.text();
            const items = [...xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 15);
            
            for (const item of items) {
                const titleMatch = item[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item[1].match(/<title>(.*?)<\/title>/);
                const linkMatch = item[1].match(/<link>(.*?)<\/link>/);
                
                if (titleMatch && linkMatch) {
                    articles.push({
                        'title': titleMatch[1],
                        'link': linkMatch[1],
                        'source': source.name
                    });
                }
            }
        } catch (error) {
            console.error('Error on ' + source.name + ':', error.message);
        }
    }
    
    if (!articles.length) {
        return null;
    }
    
    let result = '📢 *Latest news - ' + sport.toUpperCase() + '*\n\n';
    
    for (const article of articles.slice(0, 10)) {
        result += '📰 *' + article.title + '*\n📌 ' + article.source + '\n🔗 ' + article.link + '\n\n';
    }
    
    return result.trim();
}

let handler = async (message, {conn: connection}) => {
    const chatId = message.sender;
    const userData = global.db.data.users[chatId] || {};
    const preferredSport = userData.preferredSport || 'calcio';
    const newsContent = await getNews(preferredSport);
    
    if (newsContent) {
        await connection.sendMessage(message.chat, {
            'text': newsContent,
            'footer': '🗞 Updated news',
            'headerType': 1
        }, { 'quoted': message });
    } else {
        message.reply('📭 No news found.');
    }
};

handler.command = /^news$/i;
handler.tags = ['news'];
handler.help = ['news'];

export default handler;