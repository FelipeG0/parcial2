import { Bono } from '../../bonos/entities/bono.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["codigo"])
export class Clase {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    nombre : string 

    @Column()
    codigo : string 

    @Column('int')
    nCreditos : number

    @OneToMany(() => Bono, (bono) => bono.clase)
    bonos : Bono[]

    @ManyToOne(() => Usuario, (usuario) => usuario.clases)
    usuario : Usuario





}
