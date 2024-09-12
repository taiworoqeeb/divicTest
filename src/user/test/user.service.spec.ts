import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from 'src/app.module';


describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;




  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[AppModule]
    })
    .compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get(PrismaService);

    await prismaService.user.deleteMany({})

  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('registerUserAccountService', () => {

    it('should create a new user if email is not used', async () => {


      const registerInput = { email: 'new@example.com', password: 'password123' };

      const {status, statusCode, message }  = await userService.registerUserAccountService(registerInput);

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK),
      expect(message).toEqual('Account created successfully');

    });

    it('should return error if email is already used', async () => {

      const registerInput = { email: 'new@example.com', password: 'password123' };

      const { status, statusCode, message } = await userService.registerUserAccountService(registerInput);

      expect(status).toBeFalsy;
      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST),
      expect(message).toEqual('Email has already been used');
    });

  });

  describe('loginUserAccountService', () => {
    it('should return error if email does not exist', async () => {

      const loginInput = { email: 'invalid@example.com', password: 'test123' };

      const {status, statusCode, message} = await userService.loginUserAccountService(loginInput);

        expect(status).toBeFalsy
        expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
        expect(message).toEqual('The email and/or password are incorrect.')

    });

    it('should return error if password is incorrect', async () => {

      const loginInput = { email: 'test@example.com', password: 'wrongpassword' };

      const  {status, statusCode, message}  = await userService.loginUserAccountService(loginInput);
      expect(status).toBeFalsy
      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
      expect(message).toEqual('The email and/or password are incorrect.')
    });

    it('should login user and return JWT token if credentials are valid', async () => {

      const loginInput = { email: 'new@example.com', password: 'password123'  };
      const  {status, statusCode, message, data}  = await userService.loginUserAccountService(loginInput);


      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK),
      expect(message).toEqual('Login successfully');
      expect(data).toHaveProperty("token")
    });
  });

  describe("fetch user details", () =>{

    it('should fetch user id and email', async() =>{
      const user = await prismaService.user.findUnique({
        where:{
          email: "new@example.com"
        }
      })

      const {status, statusCode, message, data} = await userService.getUserAccountService(user.id)
      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK),
      expect(message).toEqual('User fetched successfully');
      expect(data.id).toEqual(user.id)
      expect(data.email).toEqual(user.email)
      expect(data.createdAt).toEqual(user.createdAt)
      expect(data.updatedAt).toEqual(user.updatedAt)
    })

    it("should return error if user doesn't exist", async() =>{
      const {status, statusCode, message} = await userService.getUserAccountService("1")
      expect(status).toBeFalsy;
      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST),
      expect(message).toEqual('User not found');

    })

  })

  describe('registerUserBiometricKeyService', () => {
    it('should return error if user is not found', async () => {

      const userId = '1';
      const biometricInput = { biometricKey: 'somekey' };

      const {status, statusCode, message} = await userService.registerUserBiometricKeyService(userId, biometricInput);


      expect(status).toBeFalsy;
      expect(statusCode).toEqual(HttpStatus.BAD_REQUEST),
      expect(message).toEqual('User not found');

    });

    it('should register biometric key for a valid user', async () => {

      const user = await prismaService.user.findUnique({
        where:{
          email: "new@example.com"
        }
      })

      const biometricInput = { biometricKey: 'somekey' };

      const {status, statusCode, message} = await userService.registerUserBiometricKeyService(user.id, biometricInput);

      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK),
      expect(message).toEqual('Biometric key registered successfully');
    });
  });

  describe('loginUserUserBiometricKeyService', () => {
    it('should return error if user does not exist', async () => {

      const loginBiometricInput = {biometricKey: 'somekey-null'};

      const {status, statusCode, message} = await userService.loginUserWithBiometricKeyService(loginBiometricInput);

        expect(status).toBeFalsy
        expect(statusCode).toEqual(HttpStatus.BAD_REQUEST)
        expect(message).toEqual('Invalid biometric key')

    });

    it('should login user and return JWT token if credentials are valid', async () => {

      const loginBiometricInput = {biometricKey: 'somekey'};
      const  {status, statusCode, message, data}  = await userService.loginUserWithBiometricKeyService(loginBiometricInput);


      expect(status).toBeTruthy;
      expect(statusCode).toEqual(HttpStatus.OK),
      expect(message).toEqual('Login successfully');
      expect(data).toHaveProperty("token")
    });
  });


  afterAll(async () => {
    await prismaService.user.deleteMany({})
    await prismaService.$disconnect();
  });
});
