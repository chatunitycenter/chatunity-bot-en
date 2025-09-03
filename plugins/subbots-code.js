const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  MessageRetryMap,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys');

import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from 'qrcode';
import crypto from 'crypto';
import fs from 'fs';
import pino from 'pino';
import * as ws from 'ws';

const { CONNECTING } = ws;
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

// Initialize global connections array if not already initialized
if (!(global.conns instanceof Array)) global.conns = [];

// Define an asynchronous handler function
let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
  
  // Retrieve bot settings from global database
  const bot = global.db.data.settings[_conn.user.jid] || {};

  // Check if the 'jadibotmd' command is enabled
  if (!bot.jadibotmd) {
    return m.reply('Command disabled by my creator. Use ".enable serbot" to activate.');
  }

  // Decide which connection to use based on args
  let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn;

  // Define an async function to set up the bot
  async function serbot() {
    // Extract the sender's username (before '@') to create a user-specific folder
    let authFolderB = m.sender.split('@')[0];
    const userFolderPath = `./varebot-sub/${authFolderB}`;

    // Check if the user folder exists; if not, create it
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }
    
    // Additional setup logic would go here...
  }
  // Call the setup function
  await serbot();
  }
      
