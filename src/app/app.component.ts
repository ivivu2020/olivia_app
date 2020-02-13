import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, IonRouterOutlet, ModalController, PopoverController, ActionSheetController, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SearchHotel,Booking, ValueGlobal } from'./providers/book-service';
import { GlobalFunction } from'./providers/globalfunction';
import { Storage } from '@ionic/storage';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private toast: ToastController,
    private navCtrl: NavController,
    public searchhotel: SearchHotel,
    public gf: GlobalFunction,
    public booking: Booking,
    private storage: Storage,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    public valueGlobal: ValueGlobal,
    private fcm: FirebaseMessaging
  ) {
    this.initializeApp();
    this.storage.remove('listblogtripdefault');
    this.storage.remove('listblogdefault');
    this.storage.remove('listtopdealdefault');
    this.storage.remove('regionnamesuggest');
    this.storage.remove('deviceToken');
    this.storage.remove('listexeperienceregion');
    this.valueGlobal.countNotifi = 0;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.show();
      //this.statusBar.styleDefault();
      
      //Dynamiclink
      this.firebaseDynamicLinks.onDynamicLink().subscribe((res:any)=>{
        if(res && res.deepLink){
          var arrLink = res.deepLink.split('?');
          if(arrLink && arrLink.length >1){
            var id = arrLink[1];
            //this.navCtrl.navigateForward(['/app/tabs/hoteldetail/' + id]);
            this.navCtrl.navigateForward('/hoteldetail/'+ id);
          }
        }
      })
    });
  }

}
