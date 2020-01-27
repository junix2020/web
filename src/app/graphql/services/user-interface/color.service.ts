import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Color } from '../../models/user-interface/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  constructor(private apollo: Apollo) {}

  findAll() {
    return this.apollo
      .query<{ colors: Color[] }>({
        query: gql`
          query colors {
            colors {
              name
            }
          }
        `
      })
      .pipe(map(result => result.data.colors));
  }

  save(color: Color) {
    return this.apollo
      .mutate<{ saveColor: Color }>({
        mutation: gql`
          mutation saveColor($color: ColorInput!) {
            saveColor(color: $color) {
              name
            }
          }
        `,
        variables: { color }
      })
      .pipe(map(result => result.data.saveColor));
  }

  deleteMany(ids: string[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation deleteColors($ids: [String!]!) {
          deleteColors(ids: $ids)
        }
      `,
      variables: { ids }
    });
  }
}
