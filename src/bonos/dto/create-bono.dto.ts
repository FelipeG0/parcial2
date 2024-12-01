import { IsIn, IsInt, IsNotEmpty, IsPositive } from "class-validator"


export class CreateBonoDto {
    monto : number

    calificacion : number

    palabraClave : string

    usuarioId : number

    codigoClase : string
}
