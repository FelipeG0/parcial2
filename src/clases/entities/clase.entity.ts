import { Bono } from "src/bonos/entities/bono.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
