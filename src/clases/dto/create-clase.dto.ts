import { IsInt , MinLength} from "class-validator"

export class CreateClaseDto {

    nombre : string 

    @MinLength(10, { message: 'debe tner 10 caracteres' })
    codigo : string 

    @IsInt()
    nCreditos : number



}
