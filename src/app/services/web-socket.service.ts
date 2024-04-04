import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wb!: WebSocket;
  private wbReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  wbReady$ = this.wbReady.asObservable();

  private onMessage: Subject<{
    channel: string,
    data: any;
  }> = new Subject();

  connect() {
    this.wb = new WebSocket(window.EASY_KEYS['WEBSOCKET_URL']);
    const wb = this.wb;
    wb.onopen = () => {
      this.wbReady.next(true);
    };
    wb.onmessage = (d) => {
      this.onMessage.next(JSON.parse(d.data));
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