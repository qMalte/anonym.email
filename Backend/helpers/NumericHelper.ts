export class NumericHelper {
    static Generate(length: number): number {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }


        if (result.startsWith('0')) {
            return this.Generate(length);
        }

        return +result;
    }
}
