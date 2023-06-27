import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./User";

@Entity("aliases")
export class MailAlias extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;

    @Column() public mailbox?: string;

    @Column({default: null}) public customName?: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date

    @ManyToOne(() => User, (user) => user.aliases)
    user: User;

}
