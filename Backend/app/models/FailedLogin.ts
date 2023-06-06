import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
import {StringHelper} from "../../helpers/StringHelper";
import {authenticator} from "otplib";
import {inspect} from "util";

@Entity("failed_logins")
export class FailedLogin extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column({default: null}) public user_id: number = null;
    @Column() public ip: string;
    @Column() public counter: number;
    @Column() public created_at: Date;

}
