import {User} from "../models/User";
import {AppDataSource} from "../../database/DatabaseProvider";
import {MailService} from "./MailService";
import {Group} from "../models/Group";
import {Permission} from "../models/Permission";
import {PermissionAssignment} from "../models/PermissionAssignment";
import validator from "validator";
import {EntityRegistry} from "../../database/EntityRegistry";

export class UserService {

    static async hasPermission(user_id: number, permission_identifier: string, write: boolean): Promise<boolean> {

        if (await this.isAdmin(user_id)) {
            return true;
        }

        const permissionRepo = AppDataSource.getRepository(Permission);
        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);

        const user = await this.getUserById(user_id);

        const permission = await permissionRepo.findOneBy({
            identifier: permission_identifier
        });

        if (permission == null || user == null) {
            return false;
        }

        let assignment = await permissionAssignmentsRepo.findOneBy({
            permission_id: permission.id,
            user_id: user.id
        });

        if (assignment == null) {
            assignment = await permissionAssignmentsRepo.findOneBy({
                permission_id: permission.id,
                group_id: user.group.id
            });
        }

        if (assignment == null) {
            return false;
        }

        if (write && assignment.writeable) {
            return true;
        } else if (!write) {
            return true;
        }

        return false;
    }

    static async getPermissions(): Promise<Permission[]> {
        const permissionRepo = AppDataSource.getRepository(Permission);
        return await permissionRepo.find();
    }

    static async getPermissionAssignmentsByUser(user: User): Promise<PermissionAssignment[]> {
        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);
        return await permissionAssignmentsRepo.findBy({
            user_id: user.id
        });
    }

    static async getPermissionAssignmentsByGroup(group: Group): Promise<PermissionAssignment[]> {
        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);
        return await permissionAssignmentsRepo.findBy({
            group_id: group.id
        });
    }

    static async isAdmin(user_id: number): Promise<boolean> {
        const permissionRepo = AppDataSource.getRepository(Permission);
        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);

        const user = await this.getUserById(user_id);

        const permission = await permissionRepo.findOneBy({
            identifier: '*'
        });

        if (permission == null || user == null) {
            return false;
        }

        let assignment = await permissionAssignmentsRepo.findOneBy({
            permission_id: permission.id,
            user_id: user.id
        });

        if (assignment == null) {
            assignment = await permissionAssignmentsRepo.findOneBy({
                permission_id: permission.id,
                group_id: user.group.id
            });
        }

        if (assignment != null) {
            return true;
        }

        return false;
    }

    static async checkAndChangeData(value: any, ormAtr: string, user_id: number): Promise<boolean> {

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({
            id: user_id
        });

        if (value != null) {

            switch (ormAtr) {

                case 'firstname':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.firstname = value;
                    break;
                case 'lastname':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.lastname = value;
                    break;
                case 'birthday':
                    if (!(value instanceof Date) || !validator.isDate(value.toString())) {
                        return false;
                    }
                    user.birthday = value;
                    break;
                case 'phone':
                    if ((typeof (value) != 'string') || !validator.isMobilePhone(value)) {
                        return false;
                    }
                    user.phone = value;
                    break;
                case 'street':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.street = value;
                    break;
                case 'houseNr':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.houseNr = value;
                    break;
                case 'zip':
                    if (typeof (value) != 'number' || !validator.isAlpha(value.toString())) {
                        return false;
                    }
                    user.zip = value;
                    break;
                case 'city':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.city = value;
                    break;
                case 'country':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.country = value;
                    break;
                case 'nationality':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.nationality = value;
                    break;
                case 'username':
                    if (typeof (value) != 'string' || !validator.isAlpha(value)) {
                        return false;
                    }
                    user.username = value;
                    break;
                case 'email':
                    if (typeof (value) != 'string' || !validator.isEmail(value)) {
                        return false;
                    }
                    user.email = value;
                    break;
                case 'isActive':
                    if (typeof (value) != 'string' || !validator.isBoolean(value.toString())) {
                        return false;
                    }
                    user.isActive = value.toString().toLowerCase() === 'true';
                    break;
                case 'otpActive':
                    if (typeof (value) != 'string' || !validator.isBoolean(value.toString())) {
                        return false;
                    }
                    user.otpActive = value.toString().toLowerCase() === 'true';
                    break;
                case 'verified':
                    if (typeof (value) != 'string' || !validator.isBoolean(value.toString())) {
                        return false;
                    }
                    user.verified = value.toString().toLowerCase() === 'true';
                    break;
            }

            await userRepo.save(user);
            return true;

        }

        return false;
    }

    static async sendVerificationMail(user: User): Promise<boolean> {
        const message = `Hallo ${user.username},\n\n
vielen Dank für deine Registrierung auf unserer Webseite!\n
Um deinen Account zu aktivieren, senden wir dir in dieser E-Mail einen Bestätigungscode zu.\n
\n
Dein Bestätigungscode: ${user.verifyCode}\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;

        const mail = new MailService(user.email, 'Deine Registrierung', message);

        return await mail.send();
    }

    static async usernameAlreadyExists(username: string): Promise<boolean> {
        const userRepo = AppDataSource.getRepository(User);
        return await userRepo.countBy({username}) > 0;
    }

    static async mailAlreadyExists(email: string): Promise<boolean> {
        const userRepo = AppDataSource.getRepository(User);
        return await userRepo.countBy({email}) > 0;
    }

    static async getUserById(userId: number): Promise<User> {
        return await EntityRegistry.getInstance().User.findOne({
            relations: {
                group: true
            },
            where: {
                id: userId
            }
        });
    }
}
