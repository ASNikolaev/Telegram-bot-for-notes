export default class Note {
    constructor(date, description, id) {
        let d = date;
        this.date = [date];
        this.description = description;
        this.UserId = id;
        this.time =  new Date(d.year, d.month, d.day, d.hours, d.minutes, d.seconds).getTime()/1000

    }
}