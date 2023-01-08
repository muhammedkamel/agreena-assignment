import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Geometry } from "geojson";
import { User } from "../../users/entities/user.entity"
import { GeometryTransformer } from "helpers/geometry-transformer";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public address: string

  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, transformer: new GeometryTransformer() })
  @Index({ spatial: true })
  public coordinates: Geometry;

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
