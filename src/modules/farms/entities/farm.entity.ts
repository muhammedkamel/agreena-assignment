import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Point } from "geojson";
import { User } from "../../users/entities/user.entity"

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public address: string

  @Column("point")
  public coordinates: Point

  @Column("decimal")
  public size: number;

  @Column("decimal")
  public yield: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => User, (user) => user.farms, { nullable: false, cascade: true })
  public readonly user: User;
}
