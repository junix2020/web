import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleType } from '../../models/core-object/role-type';

const findAllQuery = gql`
  query roleTypes {
    roleTypes {
      roleTypeID
      code
      name
      description
    }
  }
`;

const findQuery = gql`
  query roleType($roleTypeID: String!) {
    roleType(roleTypeID: $roleTypeID) {
      roleTypeID
      code
      name
      description
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RoleTypeService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .watchQuery<{ roleTypes: RoleType[] }>({
        query: findAllQuery,
      })
      .valueChanges.pipe(map(result => result.data.roleTypes));
  }

  findByID(roleTypeID: string): Observable<RoleType> {
    return this.apollo
      .query<{ roleType: RoleType }>({
        query: findQuery,
        variables: { roleTypeID },
      })
      .pipe(map(result => result.data.roleType));
  }

  findByName(name: string): Observable<RoleType> {
    return this.apollo
      .query<{ roleTypeByName: RoleType }>({
        query: gql`
          query roleType($name: String!) {
            roleTypeByName(name: $name) {
              roleTypeID
              code
              name
              description
            }
          }
        `,
        variables: { name },
      })
      .pipe(map(result => result.data.roleTypeByName));
  }

  save(roleType: Partial<RoleType>) {
    return this.apollo
      .mutate<{ saveRoleType: RoleType }>({
        mutation: gql`
          mutation saveRoleType($roleType: RoleTypeInput!) {
            saveRoleType(roleType: $roleType) {
              roleTypeID
              code
              name
              description
            }
          }
        `,
        variables: { roleType },
        refetchQueries: [{ query: findAllQuery }],
      })
      .pipe(map(result => result.data));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteRoleTypes($ids: [String!]!) {
          deleteRoleTypes(ids: $ids)
        }
      `,
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery<{ roleTypes: RoleType[] }>({
          query: findAllQuery,
        });
        // Add our comment from the mutation to the end.
        data.roleTypes = data.roleTypes.filter(
          d => !ids.includes(d.roleTypeID),
        );
        // Write our data back to the cache.
        store.writeQuery({ query: findAllQuery, data });
      },
      variables: { ids },
    });
  }
}
