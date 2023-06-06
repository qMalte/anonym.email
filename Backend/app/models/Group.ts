import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm"
import {Permission} from "./Permission";

@Entity("groups")
export class Group extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public name: string;

}
