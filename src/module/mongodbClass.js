import { MongoClient } from 'mongodb';
import { nameCollection, url } from '../Token&url'
import { settingResponse } from '../function/settingResponse';
import { Cron } from '../function/CronFunc';

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
