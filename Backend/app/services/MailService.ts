import nodemailer from 'nodemailer';
import fs from "fs";

import dotenv from 'dotenv';
dotenv.config();

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

    constructor(public target: string, public subject: string,
                public message: string, public html: Template,
                public params: string[] = []) {
        //
    }

    async send(): Promise<boolean> {

        const templateFile = fs.readFileSync(`${__dirname}/../../../storage/mails/${this.html}`, 'utf8');

        let i = 1;
        this.params.forEach((param: string) => {
            templateFile.replace(`{param${i}}`, param);
            i++;
        });

        const message = {
            from: `${this.fromName} <${this.fromAddress}>`,
            to: this.target,
            subject: this.subject,
            text: this.message,
            html: templateFile
        };

        if (message == null) {
            return false;
        }

        try {
            await this.transport.sendMail(message);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export enum Template {
    PASSWORD_RESET_REQ = 'password-reset-req.mjml',
    PASSWORD_RESET_SUCCESS = 'password-reset-confirmation.mjml',
}