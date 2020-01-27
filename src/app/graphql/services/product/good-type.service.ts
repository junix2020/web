import { Injectable } from '@angular/core';
import { GoodType } from '@web/graphql/models';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const findAllQuery = gql`
  query goodTypes {
    goodTypes {
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
  query goodType($categoryTypeID: String!) {
    goodType(categoryTypeID: $categoryTypeID) {
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
export class GoodTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ goodTypes: GoodType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.goodTypes));
  }

  findByID(categoryTypeID: string): Observable<GoodType> {
    return this.apollo
      .query<{ goodType: GoodType }>({
        query: findQuery,
        variables: { categoryTypeID },
      })
      .pipe(map(result => result.data.goodType));
  }

  save(goodType: Partial<GoodType>) {
    return this.apollo
      .mutate<{ saveGoodType: GoodType }>({
        mutation: gql`
          mutation saveGoodType($goodType: GoodTypeInput!) {
            saveGoodType(goodType: $goodType) {
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
        variables: { goodType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteGoodTypes($ids: [String!]!) {
          deleteGoodTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ goodTypes: GoodType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.goodTypes = data.goodTypes.filter(
          d => !ids.includes(d.categoryTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
