import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class loginDto{
   @IsEmail({}, {message: 'Informe um email válido!'})
   @IsNotEmpty({message: 'O email é obrigatório!'})
  email:String;
   
    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória!'})
    @MinLength(6, { message: 'A senha deve ter no minimo 6 caracteres!'})
    senha:String;
}

