import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'xem'})
export class XEMPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value / 1000000;
  }

}
