import { Injectable } from '@angular/core';
import { ServiceType } from '@web/graphql/models';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const findAllQuery = gql`
  query serviceTypes {
    serviceTypes {
      categoryTypeID
      categoryType {
        categoryTypeID
        categoryType {
          code
          name
          description
        }

        statuses {
          productTypeStatusID
          startDateTime
          endDateTime
          statusType {
            statusTypeID
            name
          }
        }
      }
    }
  }
`;

const findQuery = gql`
  query serviceType($categoryTypeID: String!) {
    serviceType(categoryTypeID: $categoryTypeID) {
      categoryTypeID
      categoryType {
        categoryTypeID
        categoryType {
          categoryTypeID
          code
          name
          description
          statuses {
            categoryTypeStatusID
            startDateTime
            endDateTime
            statusType {
              statusTypeID
              name
            }
          }
        }
        statuses {
          productTypeStatusID
          startDateTime
          endDateTime
          statusType {
            statusTypeID
            name
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ServiceTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ serviceTypes: ServiceType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.serviceTypes));
  }

  findByID(categoryTypeID: string): Observable<ServiceType> {
    return this.apollo
      .query<{ serviceType: ServiceType }>({
        query: findQuery,
        variables: { categoryTypeID },
      })
      .pipe(map(result => result.data.serviceType));
  }

  save(serviceType: Partial<ServiceType>) {
    return this.apollo
      .mutate<{ saveServiceType: ServiceType }>({
        mutation: gql`
          mutation saveServiceType($serviceType: ServiceTypeInput!) {
            saveServiceType(serviceType: $serviceType) {
              categoryTypeID
              categoryType {
                categoryTypeID
                categoryType {
                  categoryTypeID
                  code
                  name
                  description
                }
              }
            }
          }
        `,
        variables: { serviceType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteServiceTypes($ids: [String!]!) {
          deleteServiceTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ serviceTypes: ServiceType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.serviceTypes = data.serviceTypes.filter(
          d => !ids.includes(d.categoryTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
