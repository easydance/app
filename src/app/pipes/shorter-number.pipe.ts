import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorterNumber',
  standalone: true
})
export class ShorterNumberPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value > 999999999) {
      return value.toString()[0] + 'M';
    }
    if (value > 999999) {
      return value.toString()[0] + 'm';
    }
    if (value > 999) {
      return value.toString()[0] + 'k';
    }
    return value;
  }

}
