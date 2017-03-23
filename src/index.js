import TelegramBot from 'node-telegram-bot-api';
import { CronJob } from 'cron';
import CronJobManager from 'cron-job-manager';
import { MongoClient } from 'mongodb';
import { token } from './Token&url'/// this is token your telegram bot

import Mongodb from './module/mongodbClass';
import MyBotClass from './module/MyBotClass';
import { nospace } from './function/settingData'
import { settingObjectForReturn } from './function/settingResponse';


const bot = new TelegramBot(token, {
    polling: true
});



const mongodb = new Mongodb();
const myBotClass = new MyBotClass();
let cron;


bot.on('message',  (msg) => {
    const botObj = {
        bot: bot,
        id: msg.from.id,
        msg: msg
    };

    checkCron(cron, botObj);
    handlerCommand(botObj, cron)
});

function handlerCommand(botObj, cron) {
    let command =  botObj.msg.text.split('!');
    switch (nospace(command[0]).toLowerCase()) {
        case "create":
            myBotClass.NewNote(botObj.msg.text, mongodb, botObj, cron);
            break;
        case "help":
            myBotClass.DescCommand(botObj);
            break;
        case "notes":
            mongodb.ReturnValue(settingObjectForReturn(command[1], botObj), botObj);
            break;
        case "remove":

            myBotClass.deleteNote(command[1], mongodb, botObj, cron);
            break;
        default:
            if (myBotClass.ActiveAction !== undefined && nospace(command[0]).toLowerCase() === 'yes'){
                myBotClass.ActiveAction.func(botObj.msg.text, mongodb, botObj, cron, true)
            } else {
                botObj.bot.sendMessage(botObj.id, 'invalid command');
            }
            break;

    }
}

function checkCron(cronLet, botObj) {
    if (cronLet === undefined) {
        cron = new CronJobManager(
            `dateCron${botObj.id}`,
            '* * * * * *',
            () => {},
            {
                start:true,
            });
    }
}
