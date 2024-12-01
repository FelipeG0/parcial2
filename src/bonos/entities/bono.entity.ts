import { Clase } from '../../clases/entities/clase.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bono {

    @PrimaryGeneratedColumn()
    id : number

    @Column('int')
    monto : number

    @Column('decimal')
    calificacion : number

    @Column()
    palabraClave : string

    @ManyToOne(() => Usuario, (usuario) => usuario.bonos)
    @JoinColumn({ name: 'usuarioId' })
    usuario: Usuario;

    @ManyToOne(() => Clase, (clase) => clase.bonos)
    @JoinColumn({ name: 'codigoClase', referencedColumnName: 'codigo'})
    clase : Clase








}
