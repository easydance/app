import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wb!: WebSocket;
  private wbReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tryConnect: Subject<void> = new Subject<void>();
  private tryConnect$: Observable<void> = this.tryConnect.asObservable();
  private onMessage: Subject<{
    channel: string,
    data: any;
  }> = new Subject();

  public wbReady$ = this.wbReady.asObservable();
  public interval: any = 0;
  public intervalOnError: any;

  connect() {
    if (this.wb?.readyState === 0 || this.wb?.readyState === 1) return;

    this.wb = new WebSocket(window.EASY_KEYS['WEBSOCKET_URL']);
    const wb = this.wb;
    wb.onopen = () => {
      console.log('onOpen');
      this.wbReady.next(true);
      clearInterval(this.interval);
      clearInterval(this.intervalOnError);
      this.interval = undefined;
      this.intervalOnError = undefined;
    };
    wb.onmessage = (d) => {
      this.onMessage.next(JSON.parse(d.data));
    };
    wb.onclose = () => {
      console.log('onClose');
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.tryConnect.next();
        }, 4000) as any;
      }
      this.wbReady.next(false);
    };
    wb.onerror = () => {
      console.log('onError');
      if (!this.intervalOnError) {
        this.intervalOnError = setInterval(() => {
          this.tryConnect.next();
        }, 4000) as any;
      }
    };
    return this.wb;
  }

  subscribe(channel: string) {
    this.wb.send(JSON.stringify({
      type: 'SUBSCRIBE',
      channel: channel
    }));

    return this.onMessage.asObservable().pipe(
      filter(d => d.channel === channel)
    );
  }

  unsubscribe(channel: string) {
    this.wb.send(JSON.stringify({
      type: 'UNSUBSCRIBE',
      channel: channel
    }));
  }
}