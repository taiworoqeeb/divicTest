
# NestJS Backend Test Task

## Project Overview and Objectives

This project is a backend API for a basic authentication system, designed using the NestJS framework and Graphql.

The primary goals of this project are:

1. **User Authentication**: Implement user registration and authentication features.

## Instructions for Setting Up the Development Environment

To set up the development environment, follow these steps:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14.x or higher).
- **npm** or **yarn**
- **NestJS CLI**: Install NestJS CLI globally by running:
    ```bash
    yarn global add @nestjs/cli
    ```
- **Postgresql**: Install Postgresql and ensure the service is running locally.
- **Prisma CLI**: Install Prisma CLI for database migrations and management


### Installation

1. **Clone the Repository**: Clone the project repository from GitHub:
    ```bash
    git clone https://github.com/taiworoqeeb/divicTest.git
    cd divicTest
    ```

2. **Install Dependencies**: Install the necessary packages using Yarn:
    ```bash
    yarn install
    ```

3. **Environment Variables**: Configure environment variables. Create a `.env` file in the project root based on the `.env.example` file provided in the repository. The following environment variables are required:

    ```plaintext
    DATABASE_URL=<your-postgres-connection-string>
    JWT_SECRET=<your-jwt-secret>
    NODE_ENV=<node-environment>
    ```

    - Replace `<your-postgres-connection-string>` with the URI for your Progresql.
    - Replace `<your-jwt-secret>` with a secret key for JWT authentication.
    -  Replace `<node-environment>` with the application environment (e.g., `development` or `production`).

4. **Database Migration**: If there are specific migrations or initial data setup scripts, run them using:
    ```bash
    yarn prisma migrate dev
    ```
    or

    ```bash
    npx prisma migrate dev
    ```

    and the generate command generates assets like Prisma Client based on the generator and data model blocks defined in your prisma/schema.prisma file

    ```bash
    yarn prisma generate
    ```
    or

    ```bash
    npx prisma generate
    ```


## How to Run the Application Locally

1. **Start the NestJS Development Server**: Use the following command to start the server:
    ```bash
    yarn start:dev
    ```

    This command will start the NestJS application in development mode. By default, it runs on `http://localhost:3000`.

2. **Access API Documentation (Apollo server)**: Once the server is running, you can access the API documentation generated by Grapql Apollo server. Open your web browser and navigate to:
    ```
    http://localhost:3000/graphql
    ```

    Here you will find the schema, the queries and the mutation, each query and mutation has a defined data input and output.
    For organization i used a response handler to format all response a uniform way.


## Unit Testing

To ensure the functionality and reliability of the application, unit tests are included. The tests are written using Jest.

### Running Unit Tests

1. **Create a env test file**: Just like you created an env file for the system will setting it up, you need to create a `.env.test` file, inside it you will add the env varibales just like the one in the `.env.example` file

    ```plaintext
    DATABASE_URL=<your-postgres-connection-string>
    JWT_SECRET=<your-jwt-secret>
    NODE_ENV=<node-environment>
    ```

    - Replace `<your-postgres-connection-string>` with the URI for your Progresql for testing.
    - Replace `<your-jwt-secret>` with a secret key for JWT authentication.
    -  Replace `<node-environment>` with the application environment (e.g., `development`).

2.  **Run the Pre test command**: Use the following to run the neccessary setup before testing the codebase

   ```bash
    yarn pretest
   ```

3.  **Run All Tests**: Use the following command to run all unit tests:
    ```bash
    yarn test
    ```

