import { IsIn, IsInt, IsNotEmpty, IsPositive } from "class-validator"
import { Clase } from "src/clases/entities/clase.entity"
import { Usuario } from "src/usuarios/entities/usuario.entity"


export class CreateBonoDto {

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    monto : number

    calificacion : number

    palabraClave : string

    @IsIn(["Profesor"])
    usuario : Usuario

    clase : Clase
}
