import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryType } from '../../models/core-object/category-type';

const findAllQuery = gql`
  query categoryTypes {
    categoryTypes {
      categoryTypeID
      code
      name
      description
      statuses {
        categoryTypeStatusID
        categoryTypeID
        startDateTime
        endDateTime
        statusType {
          statusTypeID
          name
        }
      }
    }
  }
`;

const findQuery = gql`
  query categoryType($categoryTypeID: String!) {
    categoryType(categoryTypeID: $categoryTypeID) {
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
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CategoryTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ categoryTypes: CategoryType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.categoryTypes));
  }

  findByID(categoryTypeID: string): Observable<CategoryType> {
    return this.apollo
      .query<{ categoryType: CategoryType }>({
        query: findQuery,
        variables: { categoryTypeID },
      })
      .pipe(map(result => result.data.categoryType));
  }

  findByName(name: string): Observable<CategoryType> {
    return this.apollo
      .query<{ categoryTypeByName: CategoryType }>({
        query: gql`
          query categoryType($name: String!) {
            categoryTypeByName(name: $name) {
              categoryTypeID
              code
              name
              description
            }
          }
        `,
        variables: { name },
      })
      .pipe(map(result => result.data.categoryTypeByName));
  }

  save(categoryType: Partial<CategoryType>) {
    return this.apollo
      .mutate<{ saveCategoryType: CategoryType }>({
        mutation: gql`
          mutation saveCategoryType($categoryType: CategoryTypeInput!) {
            saveCategoryType(categoryType: $categoryType) {
              categoryTypeID
              code
              name
              description
              statuses {
                categoryTypeStatusID
                categoryTypeID
                startDateTime
                endDateTime
                statusType {
                  statusTypeID
                  name
                }
              }
            }
          }
        `,
        variables: { categoryType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteCategoryTypes($ids: [String!]!) {
          deleteCategoryTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ categoryTypes: CategoryType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.categoryTypes = data.categoryTypes.filter(
          d => !ids.includes(d.categoryTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
