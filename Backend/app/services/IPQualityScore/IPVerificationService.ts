import * as superagent from 'superagent';
import {IPQualityScoreResult} from "./IPQualityScoreResult";

export class IPVerificationService {

    private static instance: IPVerificationService;

    async lookup(ip: string, allow_public_access_points: boolean = true, strictness: number = 1): Promise<IPQualityScoreResult> {
        try {
            const res = await superagent
                .get(`https://ipqualityscore.com/api/json/ip/${process.env.IP_QUALITY_PRIVATE_KEY}/${ip}?strictness=${strictness}&allow_public_access_points=${allow_public_access_points}`)

            if (res.status === 200) {
                return Object.assign(new IPQualityScoreResult(), res.body);
            }

            return null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static getInstance(): IPVerificationService {
        if (this.instance == null) {
            this.instance = new IPVerificationService();
        }
        return this.instance;
    }

}
