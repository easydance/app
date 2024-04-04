import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bypassTyping',
  standalone: true
})
export class BypassTypingPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    return value;
  }

}
