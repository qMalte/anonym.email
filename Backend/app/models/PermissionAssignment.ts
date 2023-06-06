import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm"
import {ForeignKeyMetadata} from "typeorm/metadata/ForeignKeyMetadata";
import {Permission} from "./Permission";

@Entity("permission_assignments")
export class PermissionAssignment extends BaseEntity {

    @PrimaryGeneratedColumn() public id: number;
    @Column() public permission_id: number;
    @Column({default: null}) public user_id: number;
    @Column({default: null}) public group_id: number;
    @Column() public writeable: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    public permission: Permission;

}
