import crypto from 'crypto';
import fs from 'fs';

export class RSAService {

    static decrypt(encryptedString: string) {
        try {

            const keyFile = fs.readFileSync(__dirname + '/../../storage/keys/server_private.key', 'utf-8');

            const decryptedData = crypto.privateDecrypt(
                {
                    key: keyFile,
                    padding: crypto.constants.RSA_PKCS1_PADDING
                },
                Buffer.from(encryptedString, "base64")
            );

            return decryptedData.toString();

        } catch (err) {
            console.log(err);
            return null;
        }

    }

    static encrypt(decryptedString: string, publicKey: string = null) {

        if (publicKey == null) {
            return decryptedString;
        }
        
        try {
            return crypto.publicEncrypt(
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING
                },
                Buffer.from(decryptedString)
            ).toString("base64");

        } catch (err) {
            console.log(err);
            return null;
        }

    }

}
