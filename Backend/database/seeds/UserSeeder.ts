import {StringHelper} from "../../helpers/StringHelper";
import bcrypt from "bcrypt";
import {User} from "../../app/models/User";
import {AppDataSource} from "../DatabaseProvider";

export class UserSeeder {

    async run() {
        const userRepo = AppDataSource.getRepository(User);

        if (await userRepo.count() < 1) {
            for (let i = 0; i < 8; i++) {
                const user = new User();
                user.username = "user#" + i;
                user.password = await bcrypt.hash('www.weneflix.de', 10);
                user.firstname = "Max";
                user.lastname = "Mustermann";
                user.zip = 12345;
                user.birthday = new Date();
                user.city = "Essen";
                user.country = "Deutschland";
                user.email = user.username + '@mail.de';
                user.houseNr = '123';
                user.nationality = "German";
                user.street = 'Musterstraße';
                user.phone = '+49 (201) 85891444';
                user.isActive = true;
                await userRepo.save(user);
            }
        }

    }

}
