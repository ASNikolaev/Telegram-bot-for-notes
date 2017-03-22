import Note from './noteClass';
import { settingDataForCron, settingDateForObject } from '../function/settingData'
import { nospace } from '../function/settingData';
import { dateTransform } from  '../function/settingData'

export default class MyBotClass {

    constructor () {
        this.descriptionCommand = [
            `Date example: [day.month.year, hours:minutes:seconds]\n`,
            `Return  bot command and information. Example: "help!"\n`,
            `Create new note. \nExample: "create! desc: the meeting! date: date!"\n 
                      Seconds: 0-59, \n
                      Minutes: 0-59, \n
                      Hours: 0-23, \n
                      Day of Month: 1-31, \n
                      Months: 1-12, \n
                      Year: ${new Date().getFullYear()}- \n`,
            `Return all notes in specified date. Example: "Notes! [day.month.year or/and hours:minutes:seconds ]/and/or any word description  " \nif no date is specified, will return all notes \n`,
            `Remove all notes in specified date. Example: "Remove! [day.month.year or/and hours:minutes:seconds ]" \nif no date is specified, will remove all notes `
        ];

    };


    DescCommand(botObj) {
        let responce = this.descriptionCommand.reduce((result, num) => {
            return result + num + "\n"
        });
        botObj.bot.sendMessage(botObj.id, responce)
    }


    NewNote(command, mongodb, botObj, cron) {

        if (!/create/.test(command) ||
            !( /desc:/.test(command) ||
            !/description:/.test(command)) ||
            !/date:/.test(command)) {
            botObj.bot.sendMessage(botObj.id, 'invalid command');
            return
        }

        let test = command.split('!');
        let [ ,description,  date,] = test;
        let DescOrDescription = (/desc:/.test(command)) ? 'desc:' : 'description:';
        description = description.split(DescOrDescription)[1];
        date = settingDateForObject(date.split('date:')[1]);

        if (date) {
            let note = new Note(date, description, botObj.id);
            mongodb.NewValue(note);
            botObj.bot.sendMessage(botObj.id, 'the note was created');
            mongodb.ReturnValue({}, botObj, cron, true);
        } else {
            botObj.bot.sendMessage(botObj.id, 'invalid date')
        }

    }

    deleteNote(command, mongodb, botObj, cron, next = false) {
        let self = this;
        if (!next) {
            if (nospace(command) === '' || command === undefined ) {
                command = {};
                botObj.bot.sendMessage(botObj.id, 'delete all notice? yes/no');
                this.ActiveAction = {func: self.deleteNote, obj: command};
                return
            }

            command = {date: dateTransform(command, true)};

            if (!command) {
                botObj.bot.sendMessage(botObj.id, 'invalid date');
            } else {
                mongodb.ReturnValue(command, botObj, cron);

                this.ActiveAction = {func: self.deleteNote, obj: command};
                setTimeout(() => {
                    botObj.bot.sendMessage(botObj.id, 'delete the notice? yes/no');
                }, 1000);
            }

        } else {
            mongodb.ReturnValue({}, botObj, cron, true);
            mongodb.Delete(self.obj, botObj);
            botObj.bot.sendMessage(botObj.id, 'The notice was removed')
        }

    }

}