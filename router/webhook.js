process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
//https://api.telegram.org/bot6132861985:AAGOThDkgcBmBsDPvY4Qfob0sFvi_vL1F7I/setWebhook?url=https://timed-push-5lfoatyjm-myzest.vercel.app/api/webhook
const dirname = `${process.cwd()}`;
const CreatePools = require('../getPool');

module.exports = async (request, response) => {
  try {
    const { body } = request;

    if (body.message) {
      const {
        chat: { type, id, title },
        text,
        from: { username: userName, first_name, is_bot, id: chatId },
        reply_to_message,
        message_id,
      } = body.message;
      const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);
      let params = {
        id,
        is_bot,
        chatId,
        userName,
        first_name,
        type,
        title,
        text,
        reply_to_message,
        message_id,
      };

      await bot.sendMessage(id, text, {
        parse_mode: 'HTML',
        reply_to_message_id: message_id,
      });

      const work = new CreatePools();
      await work.toMultithreading();
      await bot.sendMessage('@timedPush', `<pre>${work?.text}</pre>`, {
        parse_mode: 'HTML',
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    response.send();
  }
};
