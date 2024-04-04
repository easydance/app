import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageFallback',
  standalone: true
})
export class ImageFallbackPipe implements PipeTransform {

  transform(value: string | undefined, type: 'event' | 'club' | 'user' = 'user', ...args: unknown[]): unknown {
    return value || 'assets/icons/guy-walk.svg';
  }

}
