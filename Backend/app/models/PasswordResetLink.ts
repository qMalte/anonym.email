import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
import {StringHelper} from "../../helpers/StringHelper";
import {authenticator} from "otplib";

@Entity("password_reset_links")
export class PasswordResetLink extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public user_id: number;
    @Column() public code: number;
    @Column() public expired_at: Date;

}
