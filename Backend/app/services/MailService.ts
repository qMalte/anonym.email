import nodemailer from 'nodemailer';

require("dotenv").config();

export class MailService {

    private fromAddress: string = process.env.SMTP_FROM_ADDRESS;
    private fromName: string = process.env.SMTP_FROM_NAME;

    private transport = nodemailer.createTransport({
        host: process.env.SMTP_HOSTNAME,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    });

    constructor(public target: string, public subject: string, public message: string) {
        //
    }

    async send(): Promise<boolean> {
        const message = {
            from: `${this.fromName} <${this.fromAddress}>`,
            to: this.target,
            subject: this.subject,
            text: this.message
        };

        try {
            await this.transport.sendMail(message);
            return true;
        } catch (e) {
            return false;
        }
    }
}
