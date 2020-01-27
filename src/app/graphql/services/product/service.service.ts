import { Injectable } from '@angular/core';
import { Service } from '@web/graphql/models';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const findAllQuery = gql`
  query services {
    services {
      productID
      product {
        productID
        code
        name
        description
      }
    }
  }
`;

const findQuery = gql`
  query service($productID: String!) {
    service(productID: $productID) {
      productID
      product {
        productID
        code
        name
        description
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ services: Service[] }>({
        query: findAllQuery
      })
      .valueChanges.pipe(map(result => result.data.services));
  }

  findByID(productID: string): Observable<Service> {
    return this.apollo
      .query<{ service: Service }>({
        query: findQuery,
        variables: { productID }
      })
      .pipe(map(result => result.data.service));
  }

  save(service: Partial<Service>) {
    return this.apollo
      .mutate<{ saveService: Service }>({
        mutation: gql`
          mutation saveService($service: ServiceInput!) {
            saveService(service: $service) {
              productID
              product {
                productID
                code
                name
                description
              }
            }
          }
        `,
        variables: { service },
        refetchQueries: [{ query: findAllQuery }]
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteServices($ids: [String!]!) {
          deleteServices(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ services: Service[] }>({
          query: findAllQuery
        });
        // Add our comment from the mutation to the end.
        data.services = data.services.filter(d => !ids.includes(d.productID));
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids }
    });
  }
}
