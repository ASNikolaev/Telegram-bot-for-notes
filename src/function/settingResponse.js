import { nospace } from './settingData';
import { dateTransform } from './settingData'

function settingResponse(ArrResponse) {
  return ArrResponse.reduce((result, value) => {
        let time = `${TForRes(value.date[0].hours)}:${TForRes(value.date[0].minutes)}:${TForRes(value.date[0].seconds)}`;
        let date = `${TForRes(value.date[0].day)}.${TForRes(value.date[0].month)}.${value.date[0].year}`;
        let val = `[${time}, ${date}]: ${value.description} \n\n`;
        return result + val
    }, ``);
}

function TForRes(time) {
    return (time < 10) ? `0${time}`: `${time}`
}


function settingObjectForReturn(str, botObj) {
    let date, description, missDate = false, obj = {};
    if (str === undefined || nospace(str) === '') {
        return obj
    }

    date = dateTransform(str, true);

    if (date) {
        obj.date = date;
        description = str.substring(str.indexOf("]") + 1, str.length);
        if (nospace(description) !== '' && description) {
            obj.description = description
        }
    } else {
        botObj.bot.sendMessage(botObj.id, 'invalid date or description')
    }
  return obj
}


export {settingResponse, settingObjectForReturn}