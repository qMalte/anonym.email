import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable
} from "typeorm"
import {authenticator} from "otplib";
import {Group} from "./Group";
import {MailAlias} from "./MailAlias";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column({default: null}) public username: string;
    @Column({default: null}) public password: string;
    @Column({default: null}) public firstname: string;
    @Column({default: null}) public lastname: string;
    @Column({default: null}) public birthday: Date;
    @Column() public email: string;
    @Column({default: null}) public phone: string;
    @Column({default: null}) public street: string;
    @Column({default: null}) public houseNr: string;
    @Column({default: null}) public zip: number;
    @Column({default: null}) public city: string;
    @Column({default: null}) public country: string;
    @Column({default: null}) public nationality: string;
    @Column({default: true}) public isActive: boolean;
    @Column({default: null}) public verifyCode: number;
    @Column({default: false}) public verified: boolean;
    @Column() public otpActive: boolean = false;
    @Column() public otpSecret: string = authenticator.generateSecret();

    @Column({default: 2}) public aliasLimit: number = 2;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date

    @ManyToOne(() => Group, (group: Group) => group.id)
    group: Group

    @OneToMany(() => MailAlias, (mailAlias) => mailAlias.user)
    aliases: MailAlias[];

}
