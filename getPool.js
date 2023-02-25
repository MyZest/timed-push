const tunnel = require('tunnel');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
const { Buffer } = require('buffer');
const path = require('path');
const TelegramBot = require('telegrambot');
require('dotenv').config();
console.log('process.env:', process.env);
const api = new TelegramBot('6132861985:AAGOThDkgcBmBsDPvY4Qfob0sFvi_vL1F7I');
const defaultHeaders = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'zh-CN,zh;q=0.9',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
};

class createPools {
  constructor() {
    this.text = '';
  }

  async toMultithreading() {
    const tasks = [
      'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/ss',
      'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/ssr',
      'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/v2',
      'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/vless',
      'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/all',
      'https://raw.fastgit.org/fanqiangfeee/freefq/main/v2ray',
    ];
    let text = '';
    for (const url of tasks) {
      const data = await this.getIps(url);
      if (!_.isEmpty(data)) {
        text += data;
      }
    }

    const buf = Buffer.from(text, 'utf-8');
    const encodedText = buf.toString('base64');
    // console.log(encodedText);
    this.text = encodedText;
    try {
      await this.toSend();
    } catch (error) {}
  }

  async getIps(url) {
    try {
      const { data: result } = await axios({
        url,
        headers: defaultHeaders,
      });
      // 将base64编码转换成字节
      let bytes = Buffer.from(result, 'base64');
      // 将字节转换成字符串
      let text = bytes.toString('utf8');
      // console.log('text:', text);
      return text;
    } catch (error) {
      return '';
    }
  }

  async toSend() {
    let fileName = path.join(__dirname, './airport.txt');
    fs.writeFileSync(fileName, this.text, 'utf-8');
    await api.sendMessage({
      chat_id: '@timedPush',
      text: `<pre>${this.text}</pre>`,
      parse_mode: 'HTML',
    });
    await api.sendDocument({
      chat_id: '@timedPush',
      document: fs.readFileSync(fileName, 'utf-8'),
    });
  }

  // toDeskop() {
  //   let fileName = path.join(__dirname, './get/airport');
  //   fs.writeFileSync(fileName, this.text, 'utf-8');
  //   console.log('写入成功:');
  // }
}

const work = new createPools();
work.toMultithreading();
module.exports = work.toMultithreading;
