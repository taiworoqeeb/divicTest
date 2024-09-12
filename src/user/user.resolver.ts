import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { responseHandler, ResponseHandler } from 'src/utils';
import { LoginUserInput, LoginUserWithBiometricKey, RegisterUserBiometricKey, RegisterUserInput } from './dto/user.dto';
import { HttpStatus, UseGuards } from '@nestjs/common';
import {GqlAuthGuard} from '../middleware/guard/gql-auth.guard'

@Resolver(() => ResponseHandler)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => ResponseHandler,  {description: "User registers their account with email and password"})
  async registerUserAccount(@Args('registerUserInput') registerUserInput: RegisterUserInput ):Promise<ResponseHandler>{
    try {
      const result = await this.userService.registerUserAccountService(registerUserInput);
      return result
    } catch (error) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }
  @Mutation(() => ResponseHandler,  {description: "Users logs in with email and password"})
  async loginUserAccount(@Args('loginUserInput') loginUserInput: LoginUserInput ):Promise<ResponseHandler> {
    try {
      const result = await this.userService.loginUserAccountService(loginUserInput);
      return result
    } catch (error) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }

  @Mutation(() => ResponseHandler,  {description: "User registers their unique biometric key"})
  @UseGuards(GqlAuthGuard)
  async registerUserBiometricKey(@Args("id", {type: () => String}) id: string, @Args('registerUserBiometricKey') registerUserBiometricKey: RegisterUserBiometricKey ):Promise<ResponseHandler>{
    try {
      const result = await this.userService.registerUserBiometricKeyService(id,registerUserBiometricKey);
      return result
    } catch (error) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }

  @Mutation(() => ResponseHandler, {description: "User uses their unique biometric key to login"})
  async loginUserWithBiometricKey(@Args('loginUserWithBiometricKey') loginUserWithBiometricKey: LoginUserWithBiometricKey ):Promise<ResponseHandler> {
    try {
      const result = await this.userService.loginUserWithBiometricKeyService(loginUserWithBiometricKey);
      return result
    } catch (error) {
      return responseHandler({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      })
    }
  }

  @Query(() => ResponseHandler,  {description: "User fetch their profile details"})
  @UseGuards(GqlAuthGuard)
  async getUserAccountById(@Args("id", {type: () => String}) id: string):Promise<ResponseHandler>{
      try {
        const result = await this.userService.getUserAccountService(id);
        return result
      } catch (error) {
        return responseHandler({
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message
        })
      }
  }
}
