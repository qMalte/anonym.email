import {UserSeeder} from "./seeds/UserSeeder";
import {PermissionsSeeder} from "./seeds/PermissionsSeeder";

export class DatabaseSeeder {

    static async run() {
        await new UserSeeder().run();
        await new PermissionsSeeder().run();
    }

}
