"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
class DateHelper {
    static addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
    }
    static addMinutes(minutes, date = new Date()) {
        return new Date(date.getTime() + minutes * 60000);
    }
    static removeMinutes(minutes, date = new Date()) {
        return new Date(date.getTime() - minutes * 60000);
    }
    static addSeconds(seconds, date = new Date()) {
        const newDate = new Date(date.getTime() + seconds * 1000);
        return newDate;
    }
    static isExpired(expirationDate) {
        const currentDate = new Date();
        return currentDate > expirationDate;
    }
}
exports.DateHelper = DateHelper;
//# sourceMappingURL=DateHelper.js.map