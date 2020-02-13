import { Injectable } from '@angular/core';
import { ToastController, Events, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import {
  Observable,
  fromEvent,
  merge,
  of
} from 'rxjs';

import {
  mapTo
} from 'rxjs/operators';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkProvider {

  private onlineStatus: Observable < boolean > = null;

  constructor(public alertCtrl: ToastController, 
    public network: Network,
    public eventCtrl: Events, private platform: Platform) {
      this.onlineStatus = Observable.create(observer => {
        observer.next(true);
      }).pipe(mapTo(true));
      if (this.platform.is('cordova')) {
        // on Device
        this.onlineStatus = merge(
          this.network.onConnect().pipe(mapTo(true)),
          this.network.onDisconnect().pipe(mapTo(false)));
      } else {
        // on Browser
        this.onlineStatus = merge( of (navigator.onLine),
          fromEvent(window, 'online').pipe(mapTo(true)),
          fromEvent(window, 'offline').pipe(mapTo(false))
        );
      }
     }

     public getNetworkType(): string {
      return this.network.type
    }
  
    public getNetworkStatus(): Observable < boolean > {
      return this.onlineStatus;
    }

    public setNetworkStatus(){
      this.onlineStatus.pipe(mapTo(true));
    }

    isOnline(): boolean {
      return navigator.onLine;
    }

    isOffline(): boolean {
      return !navigator.onLine;
    }
}