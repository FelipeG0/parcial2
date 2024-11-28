import { Bono } from "src/bonos/entities/bono.entity";
import { Clase } from "src/clases/entities/clase.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id : number 

    @Column('int')
    nCedula : number 

    @Column()
    nombre: string
    
    @Column()
    grupoInvestigacion : string 

    @Column('int')
    nExtension : number

    @Column()
    rol : string 

    @Column()
    jefe : Usuario

    @OneToMany(() => Bono, (bono) => bono.usuario)
    bonos : Bono[]

    @OneToMany(() => Clase, (clase) => clase.usuario)
    clases : Clase[]


}
