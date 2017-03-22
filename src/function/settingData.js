function isValidDate(str){
    let input = str.match(/\d+/g),
        date = new Date(input[2], input[1] - 1, input[0]);

    return date.getFullYear() == input[2] &&
        date.getDate()     == input[0] &&
        date.getMonth()    == input[1] - 1;
}

function isValidTime(str) {

    let [hours, minutes, seconds] = str.split(':');
    if (hours > 23 || minutes > 59 || seconds > 59) {
        return true
    }
    return false
}

function nospace(str) {
    let VRegExp = new RegExp(/^(\s|\u00A0)+/g),
        VResult = str.replace(VRegExp, '');
    return VResult
}

function settingDateForObject(date) {
    let sequence = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds(),
    };

    date = dateTransform(date);

    if (!date) {
        return false
    }

    for (let key in date) {
        date[key] = Number(date[key])
    }

    for (let key in date) {
        if (date[key] > sequence[key])  {
            return date
        } else if (date[key] < sequence[key]) {
            return false
        }
    }
    return false
}


function dateTransform(date, find = false) {
    let number, time;
    date = date.substring(date.indexOf("[") + 1, date.indexOf("]"));
    date = date.split(',');
    date = date.map((item) => {
        return nospace(item)
    });

    if (date[0]) {
        if (/\d\d[.]\d\d[.]\d\d/.test(date[0])) {
            number = date[0];
            if (!isValidDate(number)) return false
        } else if (/\d\d:\d\d:\d\d/.test(date[0])) {
            time = date[0];
            if (isValidTime(time)) return false
        } else return false
    }

    if (date[1]) {
        if (/\d\d[.]\d\d[.]\d\d/.test(date[1])) {
            number = date[1];
            if (!isValidDate(number)) return false
        } else if (/\d\d:\d\d:\d\d/.test(date[1])) {
            time = date[1];
            if (isValidTime(time)) return false
        } else return false
    }

    date = {};

    if (number !== undefined) {
        let [day, month, year] = number.split('.');
        date = Object.assign({}, date, {year, month, day});
    }

    if (time !== undefined) {
        let [hours, minutes, seconds] = time.split(':');
        date = Object.assign({}, date, {hours, minutes, seconds});
    }

    if (Object.keys(date).length === 0) return false;


   for (let key in date) {
       date[key] = Number(date[key])
   }

   if (find) {
       date = {$elemMatch: date}
   }

   return date
}


function settingDataForCron(objDate) {

    let date = [];

    for (let key in objDate) {
        if (key === 'year') continue;
        if (key === 'month') {
            objDate[key] -= 1
        }
        date.push(objDate[key]);
        if (key === 'month') {
            objDate[key] += 1
        }
    }

    date = date.reverse();
    date = date.reduce((result, value) => {
        return result + ` ${value}`
    });
    date += ` *`;
    return date
}


export {nospace, settingDateForObject, dateTransform, settingDataForCron}