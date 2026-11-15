import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{
   @IsEmail({}, {message: 'Informe um email válido!'})
   @IsNotEmpty({message: 'O email é obrigatório!'})
  email:string;
   
    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória!'})
    @MinLength(6, { message: 'A senha deve ter no minimo 6 caracteres!'})
    senha:string;
}

