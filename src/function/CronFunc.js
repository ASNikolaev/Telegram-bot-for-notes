import { settingDataForCron } from '../function/settingData';
import { settingResponse } from '../function/settingResponse';


function Cron(cron, botObj, response, self) {
    let cronTime =  settingDataForCron(response[0].date[0]);
    cron.update(
        `dateCron${botObj.id}`,
        cronTime,
        () => {
            let sequence = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                hours: new Date().getHours(),
                minutes: new Date().getMinutes(),
                seconds: new Date().getSeconds(),
            };

            let time = new Date(
                    sequence.year,
                    sequence.month,
                    sequence.day,
                    sequence.hours,
                    sequence.minutes,
                    sequence.seconds).getTime()/1000;

            botObj.bot.sendMessage(botObj.id, settingResponse([response[0]]));
            self.Delete({time: {$lte: time}}, botObj)
        });
}

export { Cron }