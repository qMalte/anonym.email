import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
import {StringHelper} from "../../helpers/StringHelper";
import {authenticator} from "otplib";

@Entity("blacklisted_ips")
export class BlacklistedIP extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public ip: string;
    @Column() public created_at: Date;
    @Column() public expired_at: Date;

}
