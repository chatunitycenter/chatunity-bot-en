let userSpamCounters = {};  // Start
const STICKER_LIMIT = 6;  // Start
const PHOTO_VIDEO_LIMIT = 13;  // Start
const RESET_TIMEOUT = 5000;  // Start

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat] || {};
    let bot = global.db.data.settings[this.user.jid] || {};
    let delet = m.key.participant;
    let bang = m.key.id;
    const sender = m.sender;  // Start

    // Start
    if (!userSpamCounters[m.chat]) {
        userSpamCounters[m.chat] = {};
    }
    if (!userSpamCounters[m.chat][sender]) {
        userSpamCounters[m.chat][sender] = { stickerCount: 0, photoVideoCount: 0, tagCount: 0, messageIds: [], lastMessageTime: 0, timer: null };
    }

    const counter = userSpamCounters[m.chat][sender];
    const currentTime = Date.now();

    // Start
    const isSticker = m.message?.stickerMessage;
    // DlStart
    const isPhoto = m.message?.imageMessage || m.message?.videoMessage;
    // Start
    const isTaggingAll = m.message?.extendedTextMessage?.text?.includes('@all') || m.message?.extendedTextMessage?.text?.includes('@everyone');

    if (isSticker || isPhoto || isTaggingAll) {
        if (isSticker) {
            counter.stickerCount++;
        } else if (isPhoto) {
            counter.photoVideoCount++;
        } else if (isTaggingAll) {
            counter.tagCount++;
        }

        counter.messageIds.push(m.key.id);
        counter.lastMessageTime = currentTime;

        // Start
        if (counter.timer) {
            clearTimeout(counter.timer);
        }

        // Start
        const isStickerSpam = counter.stickerCount >= STICKER_LIMIT;
        const isPhotoVideoSpam = counter.photoVideoCount >= PHOTO_VIDEO_LIMIT;
        const isTagSpam = counter.tagCount > 0;

        if (isStickerSpam || isPhotoVideoSpam || isTagSpam) {
            if (isBotAdmin && bot.restrict) {
                try {
                    console.log('Spam detected! Modifying group settings...');

                    // Start
                    await conn.groupSettingUpdate(m.chat, 'announcement');
                    console.log('Only administrators can send messages.');

                    // Start
                    if (!isAdmin) {
                        let responseb = await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
                        console.log(`Participant removal response: ${JSON.stringify(responseb)}`);

                        if (responseb[0].status === "404") {
                            console.log('User not found or already removed.');
                        }
                    } else {
                        console.log('The user is an administrator and will not be removed.');
                    }

                    // Start
                    for (const messageId of counter.messageIds) {
                        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: messageId, participant: delet } });
                        console.log(`Message with ID ${messageId} deleted.`);
                    }
                    console.log('All spam messages have been deleted.');

                    // Start
                    await conn.groupSettingUpdate(m.chat, 'not_announcement');
                    console.log('Chat re-enabled for all members.');

                    // Start
                    await conn.sendMessage(m.chat, { text: '*antispam by Origin detected*' });
                    console.log('Antispam notification message sent.');

                    // Start
                    delete userSpamCounters[m.chat][sender];
                    console.log('Spam counter for the user reset.');

                } catch (error) {
                    console.error('Error while handling spam:', error);
                }
            } else {
                console.log('Bot is not an admin or restriction is disabled. Cannot perform the operation.');
            }
        } else {
            // Start
            counter.timer = setTimeout(() => {
                delete userSpamCounters[m.chat][sender];
                console.log('Spam counter for the user reset after timeout.');
            }, RESET_TIMEOUT);
        }
    } else {
        // Start
        if (currentTime - counter.lastMessageTime > RESET_TIMEOUT && (counter.stickerCount > 0 || counter.photoVideoCount > 0 || counter.tagCount > 0)) {
            console.log('Timeout expired. Resetting spam counter for the user.');
            delete userSpamCounters[m.chat][sender];
        }
    }

    return true;
                        }
