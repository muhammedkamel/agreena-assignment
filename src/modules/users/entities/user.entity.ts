import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Geometry } from "geojson";
import { Farm } from "../../farms/entities/farm.entity"
import { GeometryTransformer } from "helpers/geometry-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @Column()
  public address: string

  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, transformer: new GeometryTransformer() })
  @Index({ spatial: true })
  public coordinates: Geometry

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Farm, (farm) => farm.user)
  public readonly farms: Farm[];
}
