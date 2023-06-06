import dotenv from 'dotenv';

dotenv.config();

export class LoggingHelper {

    constructor(private source: string) {
    }

    private write(message: string, type: string): void {
        const day = this.format(new Date().getDay());
        const month = this.format(new Date().getMonth());
        const year = this.format(new Date().getFullYear());
        const hour = this.format(new Date().getHours());
        const minute = this.format(new Date().getHours());
        const second = this.format(new Date().getSeconds());

        const msg = `[\x1b[1m${year}-${month}-${day} ${hour}:${minute}:${second}\x1b[0m] - [${this.source}] - [${type}] ${message}`;

        // tslint:disable-next-line:no-console
        console.log(msg);
    }

    info(message: string): void {
        this.write(message, '\x1b[32mINFO\x1b[0m');
    }

    debug(message: string): void {
        if (process.env.DEBUG === "true") {
            this.write(message, '\x1b[36mDEBUG\x1b[0m');
        }
    }

    error(message: string): void {
        this.write(message, '\x1b[31mERROR\x1b[0m');
    }

    fatal(message: string): void {
        this.write(message, '\x1b[31mFATAL\x1b[0m');
    }

    warn(message: string): void {
        this.write(message, '\x1b[33mWARN\x1b[0m');
    }

    format(input: number): string {
        if (input < 10) {
            return '0' + input;
        } else {
            return input + '';
        }
    }
}
