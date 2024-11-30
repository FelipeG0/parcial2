import { Bono } from '../../bonos/entities/bono.entity';
import { Clase } from '../../clases/entities/clase.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

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

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'jefe_id' })
    jefe: Usuario;    
    
    @OneToMany(() => Bono, (bono) => bono.usuario)
    bonos : Bono[]

    @OneToMany(() => Clase, (clase) => clase.usuario)
    clases : Clase[]


}
