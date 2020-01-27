import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssociationType } from '../../models/core-object/association-type';

const findAllQuery = gql`
  query associationTypes {
    associationTypes {
      associationTypeID
      code
      name
      description
    }
  }
`;

const findQuery = gql`
  query associationType($associationTypeID: String!) {
    associationType(associationTypeID: $associationTypeID) {
      associationTypeID
      code
      name
      description
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AssociationTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ associationTypes: AssociationType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.associationTypes));
  }

  findByID(associationTypeID: string): Observable<AssociationType> {
    return this.apollo
      .query<{ associationType: AssociationType }>({
        query: findQuery,
        variables: { associationTypeID },
      })
      .pipe(map(result => result.data.associationType));
  }

  findByName(name: string): Observable<AssociationType> {
    return this.apollo
      .query<{ associationTypeByName: AssociationType }>({
        query: gql`
          query associationType($name: String!) {
            associationTypeByName(name: $name) {
              associationTypeID
              code
              name
              description
            }
          }
        `,
        variables: { name },
      })
      .pipe(map(result => result.data.associationTypeByName));
  }

  save(associationType: Partial<AssociationType>) {
    return this.apollo
      .mutate<{ saveAssociationType: AssociationType }>({
        mutation: gql`
          mutation saveAssociationType(
            $associationType: AssociationTypeInput!
          ) {
            saveAssociationType(associationType: $associationType) {
              associationTypeID
              code
              name
              description
            }
          }
        `,
        variables: { associationType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteAssociationTypes($ids: [String!]!) {
          deleteAssociationTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ associationTypes: AssociationType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.associationTypes = data.associationTypes.filter(
          d => !ids.includes(d.associationTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
