const tunnel = require('tunnel');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');
const { Buffer } = require('buffer');
const path = require('path');
const TelegramBot = require('telegrambot');
require('dotenv').config();
const dirname = `${process.cwd()}`;
const api = new TelegramBot(process.env.TELEGRAM_TOKEN);
process.on('uncaughtException', function (err) {
  console.log('err:', err);
  return [];
});
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

class CreatePools {
  constructor() {
    this.text = '';
  }

  async toMultithreading() {
    const tasks = [
      // 'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/ss',
      // 'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/ssr',
      // 'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/v2',
      // 'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/vless',
      // 'https://raw.fastgit.org/Leon406/SubCrawler/main/sub/share/all',
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

    await this.toSend();
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

  base64toFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    console.log('mime:', mime);
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // 第三个参数是 要放到文件中的内容的 MIME 类型
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  }

  async toSend() {
    // let fileName = path.join(__dirname, './airport.txt');
    // fs.writeFileSync(fileName, this.text, 'utf-8');
    // console.log('fileName:', fileName);
    // const file = fs.createReadStream(fileName);

    // const file = this.base64toFile();
    try {
      console.log('process.env.TELEGRAM_TOKEN:', process.env.TELEGRAM_TOKEN);
      await api.sendMessage({
        chat_id: '@timedPush',
        text: 'https://raw.githubusercontent.com/MrWang6w/Airport/main/get/airport.txt',
      });
      await api.sendMessage({
        chat_id: '@timedPush',
        text: this.text,
      });
    } catch (error) {
      console.log('error:', error);
    }
  }

  // toDeskop() {
  //   let fileName = path.join(__dirname, './get/airport');
  //   fs.writeFileSync(fileName, this.text, 'utf-8');
  //   console.log('写入成功:');
  // }
}

const work = new CreatePools();
work.toMultithreading();

module.exports = CreatePools;
