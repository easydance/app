import { ShorterNumberPipe } from './shorter-number.pipe';

describe('ShorterNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ShorterNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
