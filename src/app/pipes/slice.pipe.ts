import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice',
  standalone: true
})
export class SlicePipe implements PipeTransform {

  transform(value: any[], start?: number, end?: number): unknown {
    return value.slice(start || 0, end || value.length);
  }

}
