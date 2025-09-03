                        }, { quoted: receivedMsg });
                    } else {
                        m.reply("❌ Errore nella generazione dell'audio. Riprova.");
                    }
                } catch (error) {
                    console.error("Errore API:", error);
                    m.reply("❌ Errore durante l'elaborazione della richiesta. Riprova.");
                }
            }
        };

        conn.ev.on("messages.upsert", messageHandler);

    } catch (error) {
        console.error("Errore comando:", error);
        m.reply("❌ Si è verificato un errore. Riprova.");
    }
};

handler.help = ['aivoice <testo>'];
handler.tags = ['tools'];
handler.command = /^(aivoice|vai|voicex|voiceai)$/i;

export default handler;
