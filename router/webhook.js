process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const dirname = `${process.cwd()}`;

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
      console.log('process.env.TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);
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
      };

      await bot.sendMessage(id, text, {
        parse_mode: 'HTML',
        reply_to_message_id: message_id,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    response.send();
  }
};
