import fs from 'fs';
import path from 'path';

const SCHEDULE_FILE = path.join(process.cwd(), 'group_schedule.json');

let groupSchedule = {};
try {
    if (fs.existsSync(SCHEDULE_FILE)) {
        groupSchedule = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
    }
} catch (error) {
    console.error('Error loading schedules:', error);
}

function saveSchedule() {
    try {
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(groupSchedule, null, 2));
    } catch (error) {
        console.error('Error saving schedules:', error);
    }
}

function parseTimeToMs(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    let target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);
    return target - now;
}

function scheduleGroupEvents(conn, groupId, openTimeStr, closeTimeStr) {
    if (groupSchedule[groupId]?.openTimeout) clearTimeout(groupSchedule[groupId].openTimeout);
    if (groupSchedule[groupId]?.closeTimeout) clearTimeout(groupSchedule[groupId].closeTimeout);

    function planOpen() {
        if (!groupSchedule[groupId]?.active) return;
        updateGroupSetting(conn, groupId, 'not_announcement', '✅ Group is now open. Everyone can write.');
        groupSchedule[groupId].openTimeout = setTimeout(planOpen, 24 * 60 * 60 * 1000);
    }

    function planClose() {
        if (!groupSchedule[groupId]?.active) return;
        updateGroupSetting(conn, groupId, 'announcement', '🔒 Group is now closed. Only admins can write.');
        groupSchedule[groupId].closeTimeout = setTimeout(planClose, 24 * 60 * 60 * 1000);
    }

    groupSchedule[groupId].openTimeout = setTimeout(planOpen, parseTimeToMs(openTimeStr));
    groupSchedule[groupId].closeTimeout = setTimeout(planClose, parseTimeToMs(closeTimeStr));
}

async function updateGroupSetting(conn, groupId, setting, message) {
    try {
        await conn.groupSettingUpdate(groupId, setting);
        await conn.sendMessage(groupId, { text: message });
    } catch (error) {
        if (error?.output?.statusCode === 403 || (error?.message && error.message.includes('not admin'))) {
            await conn.sendMessage(groupId, { text: '❌ I cannot change settings: I am not an admin!' });
        } else {
            console.error(`[${new Date().toISOString()}] Error updating group ${groupId}:`, error);
        }
    }
}

export function initSchedule(conn) {
    for (const [groupId, settings] of Object.entries(groupSchedule)) {
        if (settings.active) {
            scheduleGroupEvents(conn, groupId, settings.openTime, settings.closeTime);
        }
    }
}

const handler = async (msg, { conn, args, isAdmin }) => {
    const groupId = msg.key.remoteJid;
    const isGroup = groupId.endsWith('@g.us');
    if (!isGroup) return conn.sendMessage(groupId, { text: '❌ This command can only be used in groups.' });
    if (!isAdmin) return conn.sendMessage(groupId, { text: '❌ Only admins can use this command.' });

    const command = args[0]?.toLowerCase();

    if (!command) {
        return conn.sendMessage(groupId, {
            text: '❓ Available commands:\n\n' +
                '• *#schedule set <open_time> <close_time>* - Set automatic schedule\n' +
                '• *#schedule disable* - Disable automatic schedule\n' +
                '• *#schedule status* - Show current schedule\n\n' +
                'Example: *#schedule set 08:00 22:00*'
        });
    }

    switch (command) {
        case 'set':
            if (args.length < 3) {
                return conn.sendMessage(groupId, {
                    text: '❌ Use the command correctly:\n*#schedule set <open_time> <close_time>*\nExample: *#schedule set 08:00 22:00*'
                });
            }
            const [openTime, closeTime] = args.slice(1);
            if (!/^\d{2}:\d{2}$/.test(openTime) || !/^\d{2}:\d{2}$/.test(closeTime)) {
                return conn.sendMessage(groupId, { text: '❌ Times must be in HH:MM format (e.g., 08:00).' });
            }
            groupSchedule[groupId] = { openTime, closeTime, active: true };
            scheduleGroupEvents(conn, groupId, openTime, closeTime);
            saveSchedule();
            return conn.sendMessage(groupId, {
                text: `✅ Schedule set successfully:\n- Open: ${openTime}\n- Close: ${closeTime}\n\nThe group will open and close automatically daily.`
            });

        case 'disable':
            if (!groupSchedule[groupId]) {
                return conn.sendMessage(groupId, { text: '❌ No schedule configured for this group.' });
            }
            groupSchedule[groupId].active = false;
            if (groupSchedule[groupId].openTimeout) clearTimeout(groupSchedule[groupId].openTimeout);
            if (groupSchedule[groupId].closeTimeout) clearTimeout(groupSchedule[groupId].closeTimeout);
            saveSchedule();
            return conn.sendMessage(groupId, { text: '✅ Automatic schedule has been disabled for this group.' });

        case 'status':
            const scheduleInfo = groupSchedule[groupId];
            if (!scheduleInfo) return conn.sendMessage(groupId, { text: '❌ No schedule configured for this group.' });
            return conn.sendMessage(groupId, {
                text:
                    `📅 Current schedule for this group:\n` +
                    `- Open: ${scheduleInfo.openTime}\n` +
                    `- Close: ${scheduleInfo.closeTime}\n` +
                    `- Status: ${scheduleInfo.active ? '✅ Active' : '❌ Disabled'}\n\n` +
                    `To change: *#schedule set <open_time> <close_time>*`
            });

        default:
            return conn.sendMessage(groupId, {
                text: '❓ Command not recognized. Use one of the following:\n\n' +
                    '• *#schedule set <open_time> <close_time>* - Set automatic schedule\n' +
                    '• *#schedule disable* - Disable automatic schedule\n' +
                    '• *#schedule status* - Show current schedule\n\n' +
                    'Example: *#schedule set 08:00 22:00*'
            });
    }
};

handler.command = ['schedule', '#schedule'];
handler.tags = ['group'];
handler.help = [
    'schedule set <open_time> <close_time> - Set automatic group open/close',
    'schedule disable - Disable automatic schedule',
    'schedule status - Show current schedule'
];
handler.group = true;
handler.admin = true;

export default handler;