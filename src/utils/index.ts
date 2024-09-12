import { ObjectType, Field, createUnionType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import {LoginOutput, UserOutput} from '../user/dto/user.dto'
import * as crypto from 'crypto';

const hashBiometricKey = (biometricKey: string): string => {
  return crypto.createHash('sha256').update(biometricKey).digest('hex');
}

const DataUnion = createUnionType({
  name: 'DataUnion', // GraphQL Union Type name
  description: "This is used to differenciate between the output of the data requested",
  types: () => [UserOutput, LoginOutput], // List the possible types
  resolveType: (value) =>{
    if("token" in value){
      return LoginOutput
    }else{
      return UserOutput
    }
  }
});

@ObjectType({description: "Organised response handler for all resolvers and services"})
class ResponseHandler {
  @Field()
  status: boolean;

  @Field()
  statusCode: number;

  @Field()
  message: string;

  @Field(() => DataUnion, {nullable: true})
  data?: typeof DataUnion;

  constructor(status: boolean, statusCode: number, message: string, data: typeof DataUnion) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

const responseHandler = (data: ResponseHandler) => {
  return {
    ...data,
  };
};

export {
  responseHandler,
  ResponseHandler,
  hashBiometricKey
};
