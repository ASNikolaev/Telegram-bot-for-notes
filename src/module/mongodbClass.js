import { MongoClient } from 'mongodb';
import { nameCollection, url } from '../Token&url'
import { settingResponse } from '../function/settingResponse';
import { settingDataForCron } from '../function/settingData';


export default class Mongodb {

    constructor() {
        this.nameCollection = nameCollection; //name collection your mongodb
        this.url = url; ///url your mongodb
    }


    ReturnValue(obj = {}, botObj, cron, setCron = false) {
        let self = this;
        let SortObj = {
            "date.year": 1,
            "date.month": 1,
            "date.day": 1,
            "date.hours": 1,
            "date.minutes": 1,
            "date.seconds": 1
        };
        obj = Object.assign({}, obj, {UserId: botObj.id});
        MongoClient.connect(this.url, function (err, db) {
            let collection = db.collection(self.nameCollection);
            collection.find(obj).sort(SortObj).toArray()
                .then(response => {
                    if (response.length !== 0) {
                        if (setCron) {
                            Cron(cron, botObj, response, self)
                        } else {
                            botObj.bot.sendMessage(botObj.id, settingResponse(response));
                        }
                    } else if (!setCron) {

                        botObj.bot.sendMessage(botObj.id, 'the cache is empty');
                    }
                })
                .catch(err => {
                    console.error(err)
                });


            db.close();
        });
    }


    NewValue(obj) {
        let self = this;
        MongoClient.connect(this.url, function (err, db) {
            let collection = db.collection(self.nameCollection);
            collection.insertMany([obj])
                .then(result => {

                })
                .catch(err => {
                    console.error(err)
                });

            db.close();
        });
    }

    Delete(obj = {}, botObj) {
        let self = this;
        obj = Object.assign({}, obj, {UserId: botObj.id});
        MongoClient.connect(this.url, function (err, db) {
            let collection = db.collection(self.nameCollection);
            collection.deleteMany(obj)
                .then(result => {
                })
                .catch(err => {
                    console.error(err)
                });
            db.close();

        });
    }
}

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

