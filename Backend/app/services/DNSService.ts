import dns from 'dns';

export class DNSService {

    static checkTxtRecord(name: string, value: string) {
        return new Promise<boolean>(resolve => {

            dns.setServers(['1.1.1.1', '1.0.0.1']);

            dns.resolveTxt(name, (err, records) => {
                if (err) {
                    resolve(false);
                    return;
                } else {
                    if (records != null && records.length != null && records.length === 1
                    && records[0] != null && records[0].length != null && records[0].length === 1) {
                        if (records[0][0] === value) {
                            resolve(true);
                            return;
                        }
                    }
                    resolve(false);
                }
            });
        });
    }

    static checkMxRecord(name: string, expectedExchange: string) {
        return new Promise<boolean>(resolve => {

            dns.setServers(['1.1.1.1', '1.0.0.1']);

            dns.resolveMx(name, (err, records) => {
                if (err) {
                    resolve(false);
                    return;
                } else {

                    let prioOfExcepted = -1;

                    for (const record of records) {
                        if (record.exchange === expectedExchange) {
                            prioOfExcepted = record.priority;
                        }
                    }

                    for (const record of records) {
                        if (record.exchange !== expectedExchange) {
                            if (record.priority > prioOfExcepted) {
                                resolve(false);
                                return;
                            }
                        }
                    }

                    if (prioOfExcepted === -1) {
                        resolve(false);
                        return;
                    }

                    resolve(true);

                }
            });
        });
    }

    static hasMxRecord(name: string) {
        return new Promise<boolean>(resolve => {

            dns.setServers(['1.1.1.1', '1.0.0.1']);

            dns.resolveMx(name, (err, records) => {
                if (err) {
                    resolve(false);
                    return;
                } else {
                    if (records == null || records.length === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            });
        });
    }

}
