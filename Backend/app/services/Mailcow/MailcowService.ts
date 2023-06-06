import * as superagent from 'superagent';
import {MailcowAlias} from "./MailcowAlias";

export class MailcowService {

    private readonly domain: string = 'anonym.email';

    private static _instance: MailcowService;

    async getAliases(): Promise<MailcowAlias[]> {
        try {
            const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/get/alias/all`;

            const res = await superagent
                .get(url)
                .set('X-API-Key', process.env.MAILCOW_API_KEY);

            const aliases: MailcowAlias[] = [];
            res.body.forEach((alias: any) => {
                aliases.push(Object.assign(new MailcowAlias(), alias));
            });

            return aliases;
        } catch (e) {
            if (e.status != null) {
                console.error(`Error while get Mailcow aliases: ${e.status}`);
            }
            return null;
        }
    }

    async addAlias(alias: string, targetAddress: string): Promise<boolean> {
        try {
            const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/add/alias`;
            const mailAlias = `${alias}@${this.domain}`;

            const res = await superagent
                .post(url)
                .set('X-API-Key', process.env.MAILCOW_API_KEY)
                .send({
                    address: mailAlias,
                    goto: targetAddress,
                    active: (1).toString()
                });

            return res.status === 200;
        } catch (e) {
            return false;
        }
    }

    async deleteAlias(address: string): Promise<boolean> {
        try {

            if (!address.includes('@')) {
                address = `${address}@${this.domain}`;
            }

            const aliases = await this.getAliases();
            const aliasObj = aliases.find(x => x.address === address);

            const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/delete/alias`;
            const data = [
                aliasObj.id.toString()
            ];

            const res = await superagent
                .post(url)
                .set('X-API-Key', process.env.MAILCOW_API_KEY)
                .send(data);

            return res.status === 200
        } catch (e) {
            return false;
        }
    }

    static getInstance(): MailcowService {
        if (this._instance == null) {
            this._instance = new MailcowService();
        }
        return this._instance;
    }

}
