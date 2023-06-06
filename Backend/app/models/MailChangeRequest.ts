import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
import {StringHelper} from "../../helpers/StringHelper";
import {authenticator} from "otplib";

@Entity("mail_change_requests")
export class MailChangeRequest extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public user_id: number;
    @Column() public email: string;
    @Column() public newMailVerified: boolean;
    @Column() public newMailToken: number;
    @Column() public oldMailVerified: boolean;
    @Column() public oldMailToken: number;
    @Column() public expire_at: Date;

}
