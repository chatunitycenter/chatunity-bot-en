        await m.reply(chatReport).catch(async e => {
            console.error('Errore primo tentativo invio:', e)
            await conn.sendMessage(m.chat, {
                text: chatReport
            }).catch(e => console.error('Errore secondo tentativo:', e))
        })

    } catch (e) {
        console.error('Errore critico:', e)
        const errorReport = `*[ ❌ ERRORE AUTO-DIAGNOSI ]*\n\n` +
            `*Tipo:* ${e.name}\n` +
            `*Messaggio:* ${e.message}\n` +
            `*Stack:* ${e.stack?.slice(0, 1000)}`
        await m.reply(errorReport).catch(async err => {
            console.error('Errore invio report:', err)
            await conn.sendMessage(m.chat, {
                text: '⚠️ *Errore critico durante l\'auto-diagnosi*\n' + e.message
            }).catch(console.error)
        })
    }
}

handler.help = ['bughunt']
handler.tags = ['creatore']
handler.command = ['bughunt']
handler.owner = true 

export default handler
