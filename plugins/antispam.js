let userSpamCounters = {};  // Initialize spam counters
const STICKER_LIMIT = 6;  // Max allowed stickers before action
const PHOTO_VIDEO_LIMIT = 13;  // Max allowed images/videos before action
const RESET_TIMEOUT = 5000;  // Time (ms) after which spam counters reset

export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat] || {};
    let bot = global.db.data.settings[this.user.jid] || {};
    let delet = m.key.participant;
    let bang = m.key.id;
    const sender = m.sender;

    // Initialize counters for this chat and sender if not already set
    if (!userSpamCounters[m.chat]) {
        userSpamCounters[m.chat] = {};
    }
    if (!userSpamCounters[m.chat][sender]) {
        userSpamCounters[m.chat][sender] = {
            stickerCount: 0,
            photoVideoCount: 0,
            tagCount: 0,
            messageIds: [],
            lastMessageTime: 0,
            timer: null
        };
    }

    const counter = userSpamCounters[m.chat][sender];
    const currentTime = Date.now();

    const isSticker = m.message?.stickerMessage;
    const isPhoto = m.message?.imageMessage || m.message?.videoMessage;
    const isTaggingAll = m.message?.extendedTextMessage?.text?.includes('@all') ||
                         m.message?.extendedTextMessage?.text?.includes('@everyone');

    // If message is sticker, photo/video or tags all members
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

        // Clear previous timer if it exists
        if (counter.timer) {
            clearTimeout(counter.timer);
        }

        // Check if spam limits are reached
        const isStickerSpam = counter.stickerCount >= STICKER_LIMIT;
        const isPhotoVideoSpam = counter.photoVideoCount >= PHOTO_VIDEO_LIMIT;
        const isTagSpam = counter.tagCount > 0;

        if (isStickerSpam || isPhotoVideoSpam || isTagSpam) {
            if (isBotAdmin && bot.restrict) {
                try {
                    console.log('Spam detected! Changing group settings...');

                    // Lock group (only admins can send messages)
                    await conn.groupSettingUpdate(m.chat, 'announcement');
                    console.log('Group is now restricted to admins only.');

                    // If user is not admin, remove them
                    if (!isAdmin) {
                        let responseb = await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
                        console.log(`Participant removal response: ${JSON.stringify(responseb)}`);

                        if (responseb[0].status === "404") {
                            console.log('User not found or already removed.');
                        }
                    } else {
                        console.log('User is an admin and will not be removed.');
                    }

                    // Delete all messages flagged as spam
                    for (const messageId of counter.messageIds) {
                        await conn.sendMessage(m.chat, {
                            delete: {
                                remoteJid: m.chat,
                                fromMe: false,
                                id: messageId,
                                participant: delet
                            }
                        });
                        console.log(`Deleted message ID: ${messageId}`);
                    }
                    console.log('All spam messages have been deleted.');

                    // Reopen group for all members
                    await conn.groupSettingUpdate(m.chat, 'not_announcement');
                    console.log('Group reopened for all participants.');

                    // Notify group of action taken
                    await conn.sendMessage(m.chat, { text: '*antispam by Origin detected*' });
                    console.log('Antispam notification sent.');

                    // Clear spam counter for user
                    delete userSpamCounters[m.chat][sender];
                    console.log('Spam counter for user has been reset.');

                } catch (error) {
                    console.error('Error handling spam:', error);
                }
            } else {
                console.log('Bot is not admin or restriction is disabled — cannot take action.');
            }
        } else {
            // Set/reset timeout to clear user's spam counter
            counter.timer = setTimeout(() => {
                delete userSpamCounters[m.chat][sender];
                console.log('Spam counter reset after timeout.');
            }, RESET_TIMEOUT);
        }
    } else {
        // Reset counter if timeout expired and previous activity exists
        if (currentTime - counter.lastMessageTime > RESET_TIMEOUT &&
            (counter.stickerCount > 0 || counter.photoVideoCount > 0 || counter.tagCount > 0)) {
            console.log('Timeout expired. Resetting user spam counter.');
            delete userSpamCounters[m.chat][sender];
        }
    }

    return true;
}
