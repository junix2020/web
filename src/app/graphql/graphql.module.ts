import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd';

export * from './services/core-object/association-type.service';
export * from './services/core-object/category-type.service';
export * from './services/core-object/role-type.service';
export * from './services/core-object/status-type.service';
export * from './services/product/good-type.service';
export * from './services/product/service-type.service';
export * from './services/product/service.service';

const uri = 'graphql';
const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: string, value: any) =>
      key === '__typename' ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename,
    );
  }
  return forward(operation).map(data => {
    return data;
  });
});

@NgModule({
  imports: [NzMessageModule],
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, messageSvc: NzMessageService) => {
        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) => {
              const messageObj = message as any;
              if (messageObj.error) {
                messageSvc.error(
                  `${messageObj.statusCode} ${messageObj.error}: ${messageObj.message}`,
                  { nzDuration: 5000 },
                );
              } else {
                messageSvc.error(message, { nzDuration: 5000 });
              }
            });
          }
          if (networkError) {
            messageSvc.error(`${networkError}`);
          }
        });

        return {
          link: ApolloLink.from([
            cleanTypeName,
            errorLink,
            httpLink.create({ uri }),
          ]),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink, NzMessageService],
    },
  ],
})
export class GraphQLModule {}
