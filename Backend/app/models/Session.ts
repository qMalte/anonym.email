import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"

@Entity("sessions")
export class Session extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public user_id: number;
    @Column() public prefix: string;
    @Column() public secret: string;
    @Column() public ip: string;
    @Column() public isVerified: boolean = false;
    @Column('text', {default: null}) public pubKey: string;
    @Column() public expired_at: Date;

    public secretDecrypted: string;

}
