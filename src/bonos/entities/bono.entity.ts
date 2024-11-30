import { Clase } from '../../clases/entities/clase.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bono {

    @PrimaryGeneratedColumn()
    id : number

    @Column('int')
    monto : number

    @Column('double')
    calificacion : number

    @Column()
    palabraClave : string

    @ManyToOne(() => Usuario, (usuario) => usuario.bonos)
    usuario : Usuario

    @ManyToOne(() => Clase, (clase) => clase.bonos)
    clase : Clase








}
