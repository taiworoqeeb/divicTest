import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { MinLength, IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType({description: "Email and password is required to sign up"})
export class RegisterUserInput {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @MinLength(6)
    @IsString()
    password: string;
}

@InputType({description: "Email and password is required to sign in"})
export class LoginUserInput {
    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
}

@InputType({description: "Biometric key is required to register user biometric"})
export class RegisterUserBiometricKey {

    @Field()
    @IsString()
    @IsNotEmpty()
    biometricKey: string;
}

@InputType({description: "User biometric is required to sign in"})
export class LoginUserWithBiometricKey {
    @Field()
    @IsString()
    @IsNotEmpty()
    biometricKey: string;
}

@ObjectType({description: "Login output will contain user details and Authorization token"})
export class LoginOutput {
    @Field()
    token: string;

    @Field()
    id: string;

    @Field()
    email: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}



@ObjectType({description: "User profile will only contain the user's id, email and timestamp"})
export class UserOutput {
    @Field()
    id?: string;

    @Field()
    email?: string;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;
}

export class UserPayload{
    id: string
    email: string
    createdAt?: Date;
    updatedAt?: Date;
}
