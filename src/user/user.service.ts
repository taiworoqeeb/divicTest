import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginOutput, LoginUserInput, LoginUserWithBiometricKey, RegisterUserBiometricKey, RegisterUserInput,} from './dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {ResponseHandler, responseHandler, hashBiometricKey} from '../utils'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async registerUserAccountService(registerUserInput: RegisterUserInput): Promise<ResponseHandler>{
        const {email, password} = registerUserInput
        const checkEmail = await this.prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(checkEmail){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Email has already been used",
                data: null
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)

        await this.prisma.user.create({
           data: {
                email: email,
                password: hashedPass
           }
        });

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Account created successfully",
            data: null
        })
    }

    async loginUserAccountService(loginUserInput: LoginUserInput): Promise<ResponseHandler>{
        const {email, password} = loginUserInput
        const checkEmail = await this.prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(!checkEmail){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "The email and/or password are incorrect.",
                data: null
            })
        }

        const validateUser = await bcrypt.compare(password, checkEmail.password);
        if(validateUser){
           const payload = {
                id: checkEmail.id,
                email: checkEmail.email,
                createdAt: checkEmail.createdAt,
                updatedAt: checkEmail.updatedAt
           }


           const accessToken = this.jwtService.sign(payload);

           const output: LoginOutput = {
                token: `Bearer ${accessToken}`,
                ...payload
           }

           return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Login successfully",
            data: output
           })
        }else{
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "The email and/or password are incorrect.",
                data: null
            })
        }
    }

    async registerUserBiometricKeyService(id: string, registerUserBiometricKey: RegisterUserBiometricKey): Promise<ResponseHandler>{
        const user = await this.prisma.user.findUnique({
            where:{
                id: id
            }
        })

        if(!user){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "User not found",
                data: null
            })
        }

        const biometricKey = hashBiometricKey( registerUserBiometricKey.biometricKey)

        await this.prisma.user.update({
            where:{id: user.id},
            data:{
                biometricKey
            }
        })

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Biometric key registered successfully",
            data: null
        })
    }

    async loginUserWithBiometricKeyService(loginUserWithBiometricKey: LoginUserWithBiometricKey): Promise<ResponseHandler>{
        const {biometricKey} = loginUserWithBiometricKey
        const biometricKeyHash = hashBiometricKey(biometricKey);

        const checkEmail = await this.prisma.user.findFirst({
            where:{
               biometricKey: biometricKeyHash
            }
        })

        if(!checkEmail){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid biometric key",
                data: null
            })
        }
           const payload = {
                id: checkEmail.id,
                email: checkEmail.email,
                createdAt: checkEmail.createdAt,
                updatedAt: checkEmail.updatedAt
           }


           const accessToken = this.jwtService.sign(payload);

           const output: LoginOutput = {
                token: `Bearer ${accessToken}`,
                ...payload
           }

           return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "Login successfully",
            data: output
           })

    }

    async getUserAccountService(id: string): Promise<ResponseHandler>{
        const user: Partial<User> = await this.prisma.user.findUnique({where: {id}, select: {email: true, id: true, createdAt: true, updatedAt: true}})

        if(!user){
            return responseHandler({
                status: false,
                statusCode: HttpStatus.BAD_REQUEST,
                message: "User not found",
                data: null
            })
        }

        return responseHandler({
            status: true,
            statusCode: HttpStatus.OK,
            message: "User fetched successfully",
            data: user
        })
    }
}
