import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusType'
})
export class StatusTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
