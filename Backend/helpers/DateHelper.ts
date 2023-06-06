export class DateHelper {

    static addHours(numOfHours: number, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }

    static addMinutes(minutes: number, date = new Date()) {
        return new Date(date.getTime() + minutes * 60000);
    }

    static removeMinutes(minutes: number, date = new Date()) {
        return new Date(date.getTime() - minutes * 60000);
    }

    static addSeconds(seconds: number, date: Date = new Date()): Date {
        const newDate = new Date(date.getTime() + seconds * 1000);
        return newDate;
    }

    static isExpired(expirationDate: Date): boolean {
        const currentDate = new Date();
        return currentDate > expirationDate;
    }

}
