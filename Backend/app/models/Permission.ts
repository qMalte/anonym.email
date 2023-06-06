import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"

@Entity("permissions")
export class Permission extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public identifier: string;
    @Column() public description: string;

}
