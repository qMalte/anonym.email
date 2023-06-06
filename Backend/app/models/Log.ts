import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

@Entity("logs")
export class Log extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column({default: null}) public title: string;
    @Column({default: null}) public description: string;
    @Column() public level: number;

    @Column({default: null}) public user_id: number;
    @Column({default: null}) public ip: string;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)"})
    public created_at: Date;
}
