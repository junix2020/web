import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StatusType } from '../../models/core-object/status-type';

const findAllQuery = gql`
  query statusTypes {
    statusTypes {
      statusTypeID
      code
      name
      description
    }
  }
`;

const findQuery = gql`
  query statusType($statusTypeID: String!) {
    statusType(statusTypeID: $statusTypeID) {
      statusTypeID
      code
      name
      description
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class StatusTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ statusTypes: StatusType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.statusTypes));
  }

  findByID(statusTypeID: string): Observable<StatusType> {
    return this.apollo
      .query<{ statusType: StatusType }>({
        query: findQuery,
        variables: { statusTypeID },
      })
      .pipe(map(result => result.data.statusType));
  }

  findByName(name: string): Observable<StatusType> {
    return this.apollo
      .query<{ statusTypeByName: StatusType }>({
        query: gql`
          query statusType($name: String!) {
            statusTypeByName(name: $name) {
              statusTypeID
              code
              name
              description
            }
          }
        `,
        variables: { name },
      })
      .pipe(map(result => result.data.statusTypeByName));
  }

  save(statusType: Partial<StatusType>) {
    return this.apollo
      .mutate<{ saveStatusType: StatusType }>({
        mutation: gql`
          mutation saveStatusType($statusType: StatusTypeInput!) {
            saveStatusType(statusType: $statusType) {
              statusTypeID
              code
              name
              description
            }
          }
        `,
        variables: { statusType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteStatusTypes($ids: [String!]!) {
          deleteStatusTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ statusTypes: StatusType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.statusTypes = data.statusTypes.filter(
          d => !ids.includes(d.statusTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
