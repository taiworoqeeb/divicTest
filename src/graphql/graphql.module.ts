import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { responseHandler } from 'src/utils';
import { APP_FILTER } from '@nestjs/core';
import { GraphqlExceptionFilter } from '../common/filters/graphql-exception.filter';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: false,
      cache: "bounded",
      sortSchema: true,
      useGlobalPrefix: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
      formatError: (error) => {

        // This function formats errors, but here we rely on the exception filter for consistency
        const statusCode =  error.extensions?.exception && error.extensions?.exception['statusCode'] ? error.extensions?.exception['statusCode'] : HttpStatus.INTERNAL_SERVER_ERROR
        const message = error.message || 'Internal server error';
        return responseHandler({
          status: false,
          statusCode,
          message,
        });
      },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionFilter,
    },
  ],
})
export class GraphqlModule {}
