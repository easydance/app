import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalEnv',
  standalone: true
})
export class GlobalEnvPipe implements PipeTransform {

  transform(value: string, defualtValue: any = undefined): unknown {
    return window.EASY_KEYS[value] || defualtValue;
  }

}
