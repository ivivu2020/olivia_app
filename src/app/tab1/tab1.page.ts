import { AuthService } from "./../providers/auth-service";
import { SearchHotel, ValueGlobal } from "./../providers/book-service";
import {
  Component,
  NgZone,
  Input,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef
} from "@angular/core";
import {
  NavController,
  ModalController,
  IonContent,
  Platform,
  IonRouterOutlet,
  LoadingController,
  AlertController,
  ToastController,
  ActionSheetController
} from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";
import * as request from "requestretry";
import * as moment from "moment";
import { InAppBrowserOptions } from "@ionic-native/in-app-browser";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { C } from "./../providers/constants";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { GlobalFunction, ActivityService } from "./../providers/globalfunction";
import { DateTime } from "ionic-angular";

import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import {
  CalendarModal,
  CalendarModalOptions,
  CalendarOptions,
  DayConfig,
  CalendarResult
} from "ion2-calendar";
import { SafariViewController } from "@ionic-native/safari-view-controller/ngx";
import { SearchHotelFilterPage } from "../search-hotel-filter/search-hotel-filter";
import { OverlayEventDetail } from "@ionic/core";
import { Network } from "@ionic-native/network/ngx";
import { NetworkProvider } from "./../network-provider.service";
import * as $ from "jquery";
import { Storage } from "@ionic/storage";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { FCM } from "@ionic-native/fcm/ngx";
import { FirebaseMessaging } from "@ionic-native/firebase-messaging/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { FirebaseDynamicLinks } from "@ionic-native/firebase-dynamic-links/ngx";
import { tap } from 'rxjs/operators';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';

/**
 *
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: "app-tab1",
  templateUrl: "./tab1.page.html",
  styleUrls: ["./tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  private subscription: Subscription;
  @ViewChild('scrollArea') content: IonContent;
  //@ViewChild(IonContent) content: IonContent;
  @ViewChildren(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  pet: string = "khachsan";
  slideData1 = [];
  slideMood;
  slideData = [];
  slideData2 = [];
  sl;
  slregion;
  slmood;
  regions = [];
  regionsinter = [];
  regionshtml = [];
  regionscheck = [];
  regionsend = [];
  regionintersend = [];
  recom = [];
  arrregion;
  arrtemp;
  recoms = [];
  arrtempdeal = [];
  email;
  jti;
  ischeck = false;
  ischeckks = true;
  ischeckvmb;
  public showCalCin = false;
  public showCalCout = false;
  public datecin: Date;
  public datecout: Date;
  public cindisplay;
  coutdisplay;
  public cin;
  gbitem;
  public cout;
  ischecklist = false;
  isenabled = true;
  co;
  gbmsg;
  json;
  index;
  ischeckclose = false;
  cinthu;
  coutthu;
  blog = [];
  items;
  adult = 2;
  child = 0;
  roomnumber = 1;
  chuoi;
  ischecksearch = false;
  recent;
  input;
  ischeckdelete;
  tabBarElement: any;
  page = 1;
  pageSize = 5;
  totalItem = 200;
  pageBlog = 1;
  pageSizeBlog = 5;
  showloadmore = true;
  showloadmoreblog = true;
  showloadmoreblogtrip = true;
  public isConnected: boolean;
  public myCalendar: any;
  myloader;
  memberid;
  versionNumber;
  username;
  arrbloglike;
  listBlogtemp;
  listBlog = [];
  blogtrips = [];
  regionnamesuggest: any = "";
  canLoadBlog: boolean = true;
  pageBlogTrip: number = 1;
  canLoadDeal: boolean = true;
  intervalTrip;
  appversion: string;
  cofdate = 0;
  cotdate = 0;
  isrefreshlist: string = "false";
  constructor(
    private iab: InAppBrowser,
    public navCtrl: NavController,
    public authService: AuthService,
    public modalCtrl: ModalController,
    private http: HttpClientModule,
    public zone: NgZone,
    public platform: Platform,
    public searchhotel: SearchHotel,
    public valueGlobal: ValueGlobal,
    public splashScreen: SplashScreen,
    public gf: GlobalFunction,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public loadCtrl: LoadingController,
    public loadingCtrl: LoadingController,
    private safariViewController: SafariViewController,
    private element: ElementRef,
    public network: Network,
    public networkProvider: NetworkProvider,
    private alertCtrl: ToastController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private fcm: FirebaseMessaging,
    private fcmNative: FCM,
    private appVersion: AppVersion,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    public actionSheetCtrl: ActionSheetController,
    public nativePageTransitions: NativePageTransitions,
    public activityService: ActivityService,
  ) {
        //lấy âm lịch
        this.getCalendarholidays();
    //Lấy app version
    this.appVersion.getVersionNumber().then(version => {
      this.appversion = version;
    });
    
    //dynamic link
    if (this.valueGlobal.fbObject) {
      var obj = this.valueGlobal.fbObject;
      if (obj && obj.deepLink) {
        var arrParams = obj.deepLink.split("?");
        if (arrParams && arrParams.length > 1) {
          var id = arrParams[1];
          this.valueGlobal.logingoback="/hoteldetail/" + id;
          //this.navCtrl.navigateForward("/app/tabs/hoteldetail/" + id);
          se.navCtrl.navigateForward('/hoteldetail/'+ id);
        }
      }
      this.valueGlobal.fbObject = null;
    }

    storage.get("jti").then((uid: any) => {
      se.memberid = uid;
    });
    //Kiểm tra mạng trước khi loaddata
    var se = this;
    //setTimeout(()=>{
    se.networkProvider.getNetworkStatus().subscribe((connected: boolean) => {
      se.isConnected = connected;
      if (se.isConnected) {
        se.networkProvider.setNetworkStatus();
        se.loaddata();
        se.getNewsBlog(0);
        se.storage.get("listtopdealdefault").then((data: any) => {
          if (data && data.length > 0) {
            //se.slideData = data;
            se.loadTopDeal(data);
            se.getHotelDealPaging();
            se.getRegions();
            se.getRegionsInternational();
          } else {
            //se.presentLoadingData();
            se.getHoteldeal();

            setTimeout(() => {
              if (se.myloader) {
                se.myloader.dismiss();
              }
            }, 2000);
          }
        });
        //se.getHoteldeal();
      } else {
        setTimeout(() => {
          se.isConnected = false;
          se.ischeck = false;
          se.slideData1 = [];
        }, 100);
        se.gf.showWarning(
          "Không có kết nối mạng",
          "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
          "Đóng"
        );
      }
    });
    //},300)
    //Xóa cache
    if (!se.intervalTrip) {
      se.intervalTrip = setInterval(() => {
        storage.remove("listblogtripdefault");
        storage.remove("listtopdealdefault");
        storage.remove("regionnamesuggest");
      }, 24 * 60 * 60 * 1000);
    }
    
    //preload mytrip
    se.getdatamytrip();
  }

  public async ngOnInit(): Promise<void> {
    await this.onEnter();
    this.gbmsg = this.searchhotel.gbmsg;
    this.gbitem = this.searchhotel.gbitem;
    this.co = this.searchhotel.flag;
    this.input = this.searchhotel.input;
    this.chuoi = this.searchhotel.chuoi;
    this.recent = this.searchhotel.recent;
    this.subscription = this.router.events.subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        (event.url === "/" ||
          event.url == "/tabs/tab1" ||
          event.url === "/app/tabs/tab1")
      ) {
        this.onEnter();
        if (this.gf.getParams("resetBlogTrips")) {
          this.blogtrips = [];
          this.pageBlogTrip = 1;
          //this.getbloglike(0);
          this.gf.setParams(false, "resetBlogTrips");
        } else {
          //this.getbloglike(1);
        }
      }
    });
  }

  public async onEnter(): Promise<void> {
    var se = this;
    se.storage.get('auth_token').then((data)=>{
      if(!data){
        // se.storage.remove("listblogtripdefault");
        // se.storage.remove("listtopdealdefault");
        // se.storage.remove("regionnamesuggest");
        se.blogtrips = [];
        se.valueGlobal.countNotifi = 0;
      }
      else
      {
        if (this.valueGlobal.blogid) {
          this.likeItemblog(this.valueGlobal.blogid);
          
        }
        else
        {
          this.getbloglike(1);
        }
      }
    })
    if (se.blogtrips.length == 0) {
      se.storage.get("listblogtripdefault").then((data: any) => {
        if (data && data.length > 0) {
          se.blogtrips = data;
        }else{
          se.getblogtrips();
        }
      });

      se.storage.get("regionnamesuggest").then((regionname: any) => {
        se.regionnamesuggest = regionname;
      });
    }
    if (se.blog.length == 0) {
      se.storage.get("listblogdefault").then((data: any) => {
        if (data && data.length > 0) {
          se.blog = data;
        }else{
          se.getNewsBlog(0);
        }
      });
      se.getNewsBlog(1);
    }
    //Lấy từ service trước
    if(se.slideData1 || se.slideData1.length == 0 ){
      se.slideData1 = se.activityService.listTopDeal;
      se.loaddata();
      se.getHotelDealPaging();
          se.storage.get('listtopregions').then(dataregion => {
            if(dataregion){
              se.loadCacheRegion();
            }else{
              se.getRegions();
            }
          })
          se.storage.get('listtopregioninternational').then(dataregionnation => {
            if(dataregionnation){
              se.loadRegionsInternational(dataregionnation);
            }else{
              se.getRegionsInternational();
            }
          })
    }
    //Nếu vẫn không có data thì lấy từ cache
    if (se.slideData1.length == 0) {
      se.loaddata();
      se.storage.get("listtopdealdefault").then((data: any) => {
        if (data && data.length > 0) {
          se.loadTopDeal(data)
          se.getHotelDealPaging();
          se.storage.get('listtopregions').then(dataregion => {
            if(dataregion){
              se.loadCacheRegion();
            }else{
              se.getRegions();
            }
          })
          se.storage.get('listtopregioninternational').then(dataregionnation => {
            if(dataregionnation){
              se.loadRegionsInternational(dataregionnation);
            }else{
              se.getRegionsInternational();
            }
          })
        } else {
          setTimeout(() => {
            se.getHoteldeal();
          }, 100);
        }
      });
    } else {
      se.loaddata();
    }

    // setTimeout(() => {
    //   if ( !(se.valueGlobal.backValue == "blog" || se.valueGlobal.backValue == "experience") && se.content) {
    //     se.content.scrollToTop(50);
    //   }
    // }, 10);

    var message = 'iVIVU đã kiểm tra tình trạng phòng của booking IVIVU6130636  tại Khu nghỉ dưỡng Novotel Phú Quốc. Và đã gửi thông tin thanh toán cho quý khách.';
    var message1 = "iVIVU đã cập nhật yêu cầu huỷ của booking IVIVU6130638  tại Khu nghỉ dưỡng Novotel Phú Quốc. Xin cảm ơn và mong quý khách tiếp tục đồng hành cùng iVIVU trong các kỳ nghỉ sắp tới.";
    var message2 ="iVIVU đã nhận 3.014.000đ thanh toán của booking IVIVU6100257  tại Khu nghỉ dưỡng Novotel Phú Quốc. Xin cảm ơn quý khách.";
    var message3 = "Kỳ nghỉ của bạn sẽ bắt đầu vào Thứ Sáu, ngày 16 tháng 08. Bạn đã sẵn sàng?";
    var message4 = "Quý khách hãy đánh giá Khách sạn Golden Bay Đà Nẵng để nhận đến 10 điểm tích lũy và giúp mọi người hiểu hơn về khách sạn này nhé!";
    var message5 = "Sẽ có tàu cao tốc đi Phú Quốc 5 sao từ Kiên Giang vào tháng 11";
    var message6="Booking IVIVU6120647 có số hiệu chuyến bay VJ338 thay đổi sang 13:15.";
    var message7="iVIVU đã cập nhật yêu cầu huỷ của booking IVIVU6130641  tại Khu nghỉ dưỡng The Grand Hồ Tràm Strip Vũng Tàu. Xin cảm ơn và mong quý khách tiếp tục đồng hành cùng iVIVU trong các kỳ nghỉ sắp tới.";
    
    // this.showActionSheetNoti({message: message1, 
    // NotifyType: 'booking', 
    // BookingCode: 'IVIVU6120696',
    // notifyAction: 'cancel',
    // title: 'Booking đã huỷ!'});

    // this.showActionSheetNoti({message: message, 
    //   NotifyType: '', 
    //   BookingCode: 'IVIVU6120696',
    //   notifyAction: 'waitingconfirmtopayment',
    //   title: 'Đã có phòng khách sạn, nhanh tay thanh toán để giữ phòng!'});

      // this.showActionSheetNoti({message: message6, 
      //   NotifyType: '', 
      //   BookingCode: 'IVIVU6120696',
      //   notifyAction: 'flychangeinfo',
      //   title: 'Thay đổi thông tin chuyến bay'});

        // this.showActionSheetNoti({message: message4, 
        //   NotifyType: 'booking', 
        //   BookingCode: 'IVIVU6120696',
        //   notifyAction: 'sharereviewofhotel',
        //   title: 'Chia sẻ nhận xét về khách sạn'});

          // this.showActionSheetNoti({message: message5, 
          //   NotifyType: 'blog', 
          //   BookingCode: 'IVIVU6120696',
          //   notifyAction: 'blogofmytrip',
          //   title: 'Bỏ túi bí kíp du lịch Phú Quốc cho chuyến đi tới!'});

            // this.showActionSheetNoti({message: message2, 
            //   NotifyType: 'booking', 
            //   BookingCode: 'IVIVU6120696',
            //   notifyAction: 'paymented',
            //   title: 'Booking đã thanh toán thành công!'});
  }

  showNotification(data){
    //chuyển qua tab mytrip
    if(data && data.BookingCode && data.notifyAction != "cancel"){
      if(data.notifyAction == "sharereviewofhotel"){
        this.navCtrl.navigateForward('/app/tabs/tab3');
        this.gf.setParams(data.BookingCode,'notifiBookingCode');
        this.gf.setParams(2,'selectedTab3');
      }
      else if(data.NotifyType == "blog" && data.notifyAction == "blogofmytrip"){
        this.valueGlobal.backValue = "tab4";
        this.navCtrl.navigateForward("/blog/" + data.BookingCode);
      }
      else if(data.NotifyType == "fly" && data.notifyAction == "flychangeinfo"){
        this.navCtrl.navigateForward('/app/tabs/tab3');
        this.gf.setParams(data.BookingCode,'notifiBookingCode');
        this.gf.setParams(data.switchObj,'notifiSwitchObj');
      }
      else{
        this.gf.setParams(data.BookingCode,'notifiBookingCode');
        this.navCtrl.navigateForward('/app/tabs/tab3');
      }
    }else{
      //show notifi
      this.showToast(data.message);
    }
  }

  async showActionSheetNoti(data){
    var se = this;
    var iconStr='ic_home';
    var subclass = '';
    if(data.NotifyType == 'bookingbegoingcombotransfer'){
      iconStr = 'ic_bus2';
    }else if(data.NotifyType == 'blog')
    {
      iconStr = 'ic_message';
    }
    else if(data.notifyAction == 'bookingbegoingcombofly' || data.notifyAction == 'flychangeinfo')
    {
      iconStr = 'ic_paper';
    }

    if(data.notifyAction == 'cancel'){
      subclass = 'fixheight-90';
    }

    if(data.notifyAction == 'flychangeinfo' || data.notifyAction == 'blogofmytrip'){
      subclass = 'fixheight-44';
    }

    let actionSheet = await se.actionSheetCtrl.create({
      cssClass: 'action-sheets-notification '+iconStr + ' '+subclass,
      header: data.title,
      animated: true,
      backdropDismiss: true,
      mode: 'ios',
      buttons: [
        {
          text: data.message,
          handler: () => {
            se.showNotification(data);
          }
        }
      ]
    });
    actionSheet.present();
    
  }

  async showToast(msg){
    let toast = await this.alertCtrl.create({
        message: msg,
        position: 'top',
        duration: 5000
    })

    toast.present();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async presentLoadingData() {
    this.myloader = await this.loadingCtrl.create({
      duration: 3000
    });
    this.myloader.present();
  }

  async presentLoadingNavigate() {
    let loading = await this.loadingCtrl.create({
      duration: 250,
    });
    loading.present();
  }

  loaddata() {
    this.page = 1;
    this.pageSize = 5;
    this.pageBlog = 1;
    this.pageBlogTrip = 1;
    this.pageSizeBlog = 5;
    this.totalItem = 200;
    this.isenabled = true;
    this.ischeck = true;
    this.gbmsg = this.searchhotel.gbmsg;
    this.gbitem = this.searchhotel.gbitem;
    this.co = this.searchhotel.flag;
    this.input = this.searchhotel.input;
    this.chuoi = this.searchhotel.chuoi;
    this.recent = this.searchhotel.recent;
    if (this.searchhotel.adult) {
      this.adult = this.searchhotel.adult;
    }
    if (this.searchhotel.child != null) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.child == 0) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.roomnumber) {
      this.roomnumber = this.searchhotel.roomnumber;
    }
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              this.chuoi = "* " + this.searchhotel.star[i];
            } else {
              this.chuoi = "* " + this.searchhotel.star[i] + ",";
            }
          } else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              this.chuoi = this.chuoi + this.searchhotel.star[i] + ",";
            } else {
              this.chuoi = this.chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (this.chuoi) {
          this.chuoi =
            this.chuoi +
            " | " +
            "đ " +
            this.searchhotel.minprice.toLocaleString() +
            " -" +
            " " +
            this.searchhotel.maxprice.toLocaleString();
        } else {
          this.chuoi =
            "đ " +
            this.searchhotel.minprice.toLocaleString() +
            " -" +
            " " +
            this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (this.chuoi) {
          this.chuoi =
            this.chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          this.chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      } else {
        this.chuoi = this.chuoi;
      }
    } else {
      this.chuoi = this.searchhotel.chuoi;
    }

    if (this.searchhotel.CheckInDate) {
      this.cin = this.searchhotel.CheckInDate;
      this.cout = this.searchhotel.CheckOutDate;

      this.datecin = new Date(this.searchhotel.CheckInDate);
      this.datecout = new Date(this.searchhotel.CheckOutDate);
      this.cindisplay = moment(this.datecin).format("DD-MM-YYYY");
      this.coutdisplay = moment(this.datecout).format("DD-MM-YYYY");
    } else {
      this.cin = new Date();
      var rescin = this.cin.setTime(this.cin.getTime() + 24 * 60 * 60 * 1000);
      var datein = new Date(rescin);
      this.cin = moment(datein).format("YYYY-MM-DD");
      this.cindisplay = moment(datein).format("DD-MM-YYYY");
      this.datecin = new Date(rescin);

      this.cout = new Date();
      var res = this.cout.setTime(
        this.cout.getTime() + 2 * 24 * 60 * 60 * 1000
      );
      var date = new Date(res);
      this.cout = moment(date).format("YYYY-MM-DD");
      this.coutdisplay = moment(date).format("DD-MM-YYYY");
      this.datecout = new Date(res);
    }

    this.cinthu = moment(this.datecin).format("dddd");
    switch (this.cinthu) {
      case "Monday":
        this.cinthu = "Thứ 2";
        break;
      case "Tuesday":
        this.cinthu = "Thứ 3";
        break;
      case "Wednesday":
        this.cinthu = "Thứ 4";
        break;
      case "Thursday":
        this.cinthu = "Thứ 5";
        break;
      case "Friday":
        this.cinthu = "Thứ 6";
        break;
      case "Saturday":
        this.cinthu = "Thứ 7";
        break;
      default:
        this.cinthu = "Chủ nhật";
        break;
    }

    this.coutthu = moment(this.datecout).format("dddd");
    switch (this.coutthu) {
      case "Monday":
        this.coutthu = "Thứ 2";
        break;
      case "Tuesday":
        this.coutthu = "Thứ 3";
        break;
      case "Wednesday":
        this.coutthu = "Thứ 4";
        break;
      case "Thursday":
        this.coutthu = "Thứ 5";
        break;
      case "Friday":
        this.coutthu = "Thứ 6";
        break;
      case "Saturday":
        this.coutthu = "Thứ 7";
        break;
      default:
        this.coutthu = "Chủ nhật";
        break;
    }
    this.getCalendarholidays();
  }

  getDayName(datecin, datecout) {
    if (!this.cinthu) {
      this.cinthu = moment(datecin).format('dddd');
      switch (this.cinthu) {
        case "Monday":
          this.cinthu = "Thứ 2"
          break;
        case "Tuesday":
          this.cinthu = "Thứ 3"
          break;
        case "Wednesday":
          this.cinthu = "Thứ 4"
          break;
        case "Thursday":
          this.cinthu = "Thứ 5"
          break;
        case "Friday":
          this.cinthu = "Thứ 6"
          break;
        case "Saturday":
          this.cinthu = "Thứ 7"
          break;
        default:
          this.cinthu = "Chủ nhật"
          break;
      }
    }
    if (!this.coutthu) {
      this.coutthu = moment(datecout).format('dddd');
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2"
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3"
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4"
          break;
        case "Thursday":
          this.coutthu = "Thứ 5"
          break;
        case "Friday":
          this.coutthu = "Thứ 6"
          break;
        case "Saturday":
          this.coutthu = "Thứ 7"
          break;
        default:
          this.coutthu = "Chủ nhật"
          break;
      }
    }
  }

  cin_click() {}

  showcalendarcin() {
    this.showCalCin = !this.showCalCin;
    if (this.showCalCout) {
      this.showCalCout = !this.showCalCout;
    }
  }

  showcalendarcout() {
    if (this.showCalCin) {
      this.showCalCin = !this.showCalCin;
    }
    this.showCalCout = !this.showCalCout;
  }
  getRegions() {
    var se = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RegionsBanner' + (se.memberid ? '?memberid=' + se.memberid : ''),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getRegions",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError, response);
      }
      if (error) {
        error.page = "main";
        error.func = "getRegions";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError, response);
      }
      se.zone.run(() => {
        se.regions = JSON.parse(body);
        se.loadRegions(se.regions);
        se.storage.get('listtopregions').then((data)=>{
          if(data){
            se.storage.remove('listtopregions').then((datanew) =>{
              se.storage.set('listtopregions', datanew);
            })
          }else{
            se.storage.set('listtopregions', se.regions);
          }
        })
        
        
      })
    });
  }

  loadRegions(listregions){
    var se = this;
    se.regions = listregions;
    for (let i = 0; i < se.regions.length; i++) {
      if(se.regions[i].image.indexOf('https') ==-1 ){
        se.regions[i].image = 'https:' + se.regions[i].image;
      }
      
      if (i == 0 || i == 4) {
        if(se.regions[i].image.indexOf('755x190') == -1){
          se.regions[i].image = se.regions[i].image.replace(".jpg", "-755x190.jpg");
        }
      }
      if (i == 2 || i == 5) {
        if(se.regions[i].image.indexOf('370x395') == -1){
          se.regions[i].image = se.regions[i].image.replace(".jpg", "-370x395.jpg");
        }
      }
      var item = { image: se.regions[i].image, name: se.regions[i].title, id: se.regions[i].regionId, regionCode: se.regions[i].code, totalHotel: se.regions[i].total };
      if (!se.checkExistsItemInArray(se.regionsend, item, 2)) {
        se.regionsend.push(item);
      }
    }
    se.slregion = se.regionsend.length;
    //se.getmood();
    se.storage.get('listtopmoods').then((data)=>{
      if(data){
        se.loadMoods(data);
        setTimeout(() => {
          se.zone.run(()=>{
            se.getmood();
          })
        }, 30000);
      }else{
        se.getmood();
      }
    })
  }

  /**
   * Lấy top vùng nước ngoài
   */
  getRegionsInternational() {
    var se = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RegionsBanner?isInternation=true' + (se.memberid ? '&memberid=' + se.memberid : ''),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getRegions",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError, response);
      }
      if (error) {
        error.page = "main";
        error.func = "getRegions";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError, response);
      }
      se.zone.run(() => {
        se.regionsinter = JSON.parse(body);
        se.storage.get('listtopregioninternational').then((data) =>{
          if(data){
            se.storage.remove('listtopregioninternational').then(()=>{
              se.storage.set('listtopregioninternational',se.regionsinter);
            })
          }else{
            se.storage.set('listtopregioninternational',se.regionsinter);
          }
        })
        se.loadRegionsInternational(se.regionsinter);
        
      })
    });
  }

  loadRegionsInternational(listregions){
    var se =this;
    se.regionsinter = listregions;
    for (let i = 0; i < se.regionsinter.length; i++) {
      if(se.regionsinter[i].image.indexOf('https') == -1 ){
        se.regionsinter[i].image = 'https:' + se.regionsinter[i].image;
      }
      if (i == 0) {
        if(se.regionsinter[i].image.indexOf('755x190') == -1 ){
          se.regionsinter[i].image = se.regionsinter[i].image.replace(".jpg", "-755x190.jpg");
        }
      }
      var item = { image: se.regionsinter[i].image, name: se.regionsinter[i].title, id: se.regionsinter[i].regionId, regionCode: se.regionsinter[i].code, totalHotel: se.regionsinter[i].total };
      if (!se.checkExistsItemInArray(se.regionintersend, item, 2)) {
        se.regionintersend.push(item);
      }

    }
  }
  // getRegions() {
  //   var se = this;
  //   var options = {
  //     method: "GET",
  //     url:
  //       C.urls.baseUrl.urlMobile +
  //       "/mobile/OliviaApis/RegionsBanner" +
  //       (se.memberid ? "?memberid=" + se.memberid : ""),
  //     timeout: 10000,
  //     maxAttempts: 5,
  //     retryDelay: 2000,
  //     headers: {
  //       apisecret: "2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU",
  //       apikey: "0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U"
  //     }
  //   };
  //   request(options, function(error, response, body) {
  //     if (response.statusCode != 200) {
  //       var objError = {
  //         page: "main",
  //         func: "getRegions",
  //         message: response.statusMessage,
  //         content: response.body,
  //         param: JSON.stringify(options),
  //         type: "warning"
  //       };
  //       C.writeErrorLog(objError,response);
  //     }
  //     if (error) {
  //       error.page = "main";
  //       error.func = "getRegions";
  //       error.param = JSON.stringify(options);
  //       C.writeErrorLog(objError,response);
  //     }
  //     se.zone.run(() => {
  //       // se.json = JSON.parse(body);
  //       se.regions = JSON.parse(body);
  //       for (let i = 0; i < se.regions.length; i++) {
  //         //if (se.regions[i].isPopular == true) {
  //         se.regions[i].image = "https:" + se.regions[i].image;
  //         if (i == 0 || i == 4) {
  //           se.regions[i].image = se.regions[i].image.replace(
  //             ".jpg",
  //             "-755x190.jpg"
  //           );
  //         }
  //         if (i == 2 || i == 5) {
  //           se.regions[i].image = se.regions[i].image.replace(
  //             ".jpg",
  //             "-370x395.jpg"
  //           );
  //         }
  //         //se.regions[i].image = se.regions[i].image.replace(".png", "-450x256.png");
  //         //se.regions[i].regionCode = se.regions[i].path.substring(1,se.regions[i].path.length);
  //         var item = {
  //           image: se.regions[i].image,
  //           name: se.regions[i].title,
  //           id: se.regions[i].regionId,
  //           regionCode: se.regions[i].code,
  //           totalHotel: se.regions[i].total
  //         };
  //         if (!se.checkExistsItemInArray(se.regionsend, item, 2)) {
  //           se.regionsend.push(item);
  //         }

  //         //}
  //       }
  //       se.slregion = se.regionsend.length;
  //       se.getmood();
  //     });
  //   });
  // }
  // /**
  //  * Lấy top vùng nước ngoài
  //  */
  // getRegionsInternational() {
  //   var se = this;
  //   var options = {
  //     method: "GET",
  //     url:
  //       C.urls.baseUrl.urlMobile +
  //       "/mobile/OliviaApis/RegionsBanner?isInternation=true" +
  //       (se.memberid ? "&memberid=" + se.memberid : ""),
  //     timeout: 10000,
  //     maxAttempts: 5,
  //     retryDelay: 2000,
  //     headers: {
  //       apisecret: "2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU",
  //       apikey: "0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U"
  //     }
  //   };
  //   request(options, function(error, response, body) {
  //     if (response.statusCode != 200) {
  //       var objError = {
  //         page: "main",
  //         func: "getRegions",
  //         message: response.statusMessage,
  //         content: response.body,
  //         param: JSON.stringify(options),
  //         type: "warning"
  //       };
  //       C.writeErrorLog(objError,response);
  //     }
  //     if (error) {
  //       error.page = "main";
  //       error.func = "getRegions";
  //       error.param = JSON.stringify(options);
  //       C.writeErrorLog(objError,response);
  //     }
  //     se.zone.run(() => {
  //       se.regionsinter = JSON.parse(body);
  //       for (let i = 0; i < se.regionsinter.length; i++) {
  //         se.regionsinter[i].image = "https:" + se.regionsinter[i].image;
  //         if (i == 0) {
  //           se.regionsinter[i].image = se.regionsinter[i].image.replace(
  //             ".jpg",
  //             "-755x190.jpg"
  //           );
  //         }
  //         //se.regionsinter[i].regionCode = se.regionsinter[i].path.substring(1,se.regionsinter[i].path.length);
  //         var item = {
  //           image: se.regionsinter[i].image,
  //           name: se.regionsinter[i].title,
  //           id: se.regionsinter[i].regionId,
  //           regionCode: se.regionsinter[i].code,
  //           totalHotel: se.regionsinter[i].total
  //         };
  //         if (!se.checkExistsItemInArray(se.regionintersend, item, 2)) {
  //           se.regionintersend.push(item);
  //         }
  //       }
  //       //se.slregion = se.regionsend.length;
  //     });
  //   });
  // }

  // getHoteldeal() {
  //   var se = this;
  //   var options = {
  //     method: "POST",
  //     url:
  //       C.urls.baseUrl.urlMobile +
  //       "/mobile/OliviaApis/TopDeals?pageIndex=" +
  //       se.page +
  //       "&pageSize=" +
  //       se.totalItem +
  //       (se.memberid ? "&memberid=" + se.memberid : ""),
  //     timeout: 10000,
  //     maxAttempts: 5,
  //     retryDelay: 2000,
  //     headers: {
  //       apisecret: "2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU",
  //       apikey: "0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U"
  //     }
  //   };
  //   request(options, function(error, response, body) {
  //     if (response.statusCode != 200) {
  //       var objError = {
  //         page: "main",
  //         func: "getHoteldeal",
  //         message: response.statusMessage,
  //         content: response.body,
  //         param: JSON.stringify(options),
  //         type: "warning"
  //       };
  //       C.writeErrorLog(objError,response);
  //     }
  //     if (error) {
  //       error.page = "main";
  //       error.func = "getHoteldeal";
  //       error.param = JSON.stringify(options);
  //       C.writeErrorLog(error,response);
  //     }
  //     se.slideData = JSON.parse(body);
  //     if (se.slideData.length > 0) {
  //       se.storage.set("listtopdealdefault", se.slideData);
  //     }

  //     var chuoi = "";
  //     se.zone.run(() => {
  //       for (let i = 0; i < se.pageSize; i++) {
  //         if (se.slideData[i] && se.slideData[i].images[0]) {
  //           var res = se.slideData[i].images[0].url.substring(0, 4);
  //           if (res != "http") {
  //             se.slideData[i].images[0].url =
  //               "https:" + se.slideData[i].images[0].url;
  //           }
  //           var minPrice = se.slideData[i].minPrice.toLocaleString();
  //           chuoi = "";
  //           var name = se.slideData[i].name.split("|");
  //           for (let x = 1; x < name.length; x++) {
  //             if (x == name.length - 1) {
  //               chuoi = chuoi + name[x];
  //             } else {
  //               chuoi = chuoi + name[x] + "|";
  //             }
  //           }
  //           switch (se.slideData[i].rating) {
  //             case 50:
  //               se.slideData[i].rating = "./assets/star/ic_star_5.svg";
  //               break;
  //             case 45:
  //               se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
  //               break;
  //             case 40:
  //               se.slideData[i].rating = "./assets/star/ic_star_4.svg";
  //               break;
  //             case 35:
  //               se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
  //               break;
  //             case 30:
  //               se.slideData[i].rating = "./assets/star/ic_star_3.svg";
  //               break;
  //             case 25:
  //               se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
  //               break;
  //             case 20:
  //               se.slideData[i].rating = "./assets/star/ic_star_2.svg";
  //               break;
  //             case 15:
  //               se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
  //               break;
  //             case 10:
  //               se.slideData[i].rating = "./assets/star/ic_star.svg";
  //               break;
  //             case 5:
  //               se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
  //               break;
  //             default:
  //               break;
  //           }
  //           //1/11/2019:  Sửa lỗi hiển thị giá combo < 1tr
  //           var item = {
  //             ischecked: 0,
  //             id: se.slideData[i].id,
  //             name: name[0],
  //             imageUrl: se.slideData[i].images[0].url,
  //             regionName: se.slideData[i].regionName,
  //             minPrice: minPrice,
  //             description: chuoi,
  //             rating: se.slideData[i].rating,
  //             priceshow: (se.slideData[i].minPrice / 1000 > 1000) ? ((se.slideData[i].minPrice / 1000)
  //               .toLocaleString()
  //               .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
  //               .replace(",", ".") ) : 0
  //           };
  //           if (!se.checkExistsItemInArray(se.slideData1, item, 1)) {
  //             se.slideData1.push(item);
  //           }
  //         }
  //       }
  //       se.sl = se.slideData1.length;
  //       se.ischeck = true;
  //       if (se.myloader) {
  //         se.myloader.dismiss();
  //       }

  //       se.getRegions();
  //       se.getRegionsInternational();
  //     });
  //   });
  //   setTimeout(() => {
  //     if (se.myloader) {
  //       se.myloader.dismiss();
  //     }
  //   }, 2000);
  // }

  getHoteldeal() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=' + se.totalItem + (se.memberid ? '&memberid=' + se.memberid : ''),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {

        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getHoteldeal",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError, response);
      }
      if (error) {
        error.page = "main";
        error.func = "getHoteldeal";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error, response);
      };
      se.slideData = JSON.parse(body);
      se.storage.get('listtopdealdefault').then((data) => {
        if(data){
          se.storage.remove('listtopdealdefault').then(()=>{
            se.storage.set('listtopdealdefault', se.slideData);
          })
        }else{
          se.storage.set('listtopdealdefault', se.slideData);
        }
      })
    
      se.loadTopDeal(se.slideData);

      
    });
  }

  loadTopDeal(listtopdeal){
    var se = this;
    se.slideData = listtopdeal;
    se.totalItem = se.slideData.length;
      se.showloadmore = se.slideData.length == se.totalItem ? false : true;
      var chuoi = "";
      se.zone.run(() => {
        for (let i = 0; i < se.pageSize; i++) {
          if (se.slideData && se.slideData[i].images[0]) {
            var res = se.slideData[i].images[0].url.substring(0, 4);
            if (res != "http") {
              se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
            }
            var minPrice = se.slideData[i].minPrice.toLocaleString();
            chuoi = "";
            var name = se.slideData[i].name.split('|');
            for (let x = 1; x < name.length; x++) {
              if (x == name.length - 1) {
                chuoi = chuoi + name[x];
              } else {
                chuoi = chuoi + name[x] + "|";
              }
            }
            switch (se.slideData[i].rating) {
              case 50:
                se.slideData[i].rating = "./assets/star/ic_star_5.svg";
                break;
              case 45:
                se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
                break;
              case 40:
                se.slideData[i].rating = "./assets/star/ic_star_4.svg";
                break;
              case 35:
                se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
                break;
              case 30:
                se.slideData[i].rating = "./assets/star/ic_star_3.svg";
                break;
              case 25:
                se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
                break;
              case 20:
                se.slideData[i].rating = "./assets/star/ic_star_2.svg";
                break;
              case 15:
                se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
                break;
              case 10:
                se.slideData[i].rating = "./assets/star/ic_star.svg";
                break;
              case 5:
                se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
                break;
              default:
                break;
            }
            var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: (se.slideData[i].minPrice / 1000 > 1000) ? ((se.slideData[i].minPrice / 1000)
              .toLocaleString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
              .replace(",", ".") ) : 0 };
            if(!se.gf.checkExistsItemInArray(se.slideData1, item, 1)){
              se.slideData1.push(item);
              
            }
          }

        }
        se.activityService.listTopDeal = se.slideData1;
        se.sl = se.slideData1.length;
        se.ischeck = true;

        if (se.myloader) {
          se.myloader.dismiss();
        }
        // if (se._infiniteScroll) {
        //   se._infiniteScroll.target.complete();
        // }
        se.loadCacheRegion();

      })
  }

  loadCacheRegion(){
    var se =this;
    se.storage.get('listtopregions').then(data => {
      if(data){
        se.loadRegions(data);
        setTimeout(() => {
          se.zone.run(()=>{
            se.getRegions();
          })
        }, 30000);
      }else{
        se.getRegions();
      }
      
    })

    se.storage.get('listtopregioninternational').then(data => {
      if(data){
        se.loadRegionsInternational(data);
        setTimeout(() => {
          se.getRegionsInternational();
        }, 30000);
      }else{
        se.getRegionsInternational();
      }
    })
  }

  checkExistsItemInArray(arrays: any, item: any, type: any) {
    var res = false;
    if (type == 1 || type == 3 || type == 2) {
      //hoteldeal || mood
      res = arrays.some(r => r.id == item.id);
    }
    if (type == 4) {
      //blog
      res = arrays.some(r => r.Id == item.Id);
    }

    return res;
  }

  /**
   * Hàm load paging topdeal (không gọi load topregion)
   */
  getHotelDealPaging() {
    var se = this;
    se.canLoadDeal = (se.slideData1.length == se.slideData.length) ? false : true;
    // if (!se.showloadmore) {
    //   return;
    // }
    let start = se.slideData1.length;
    var chuoi = "";
    se.zone.run(() => {
      for (let i = start; i < start + se.pageSize; i++) {
        if (se.slideData[i] && se.slideData[i].images[0]) {
          var res = se.slideData[i].images[0].url.substring(0, 4);
          if (res != "http") {
            se.slideData[i].images[0].url =
              "https:" + se.slideData[i].images[0].url;
          }
          var minPrice = se.slideData[i].minPrice.toLocaleString();
          chuoi = "";
          var name = se.slideData[i].name.split("|");
          for (let x = 1; x < name.length; x++) {
            if (x == name.length - 1) {
              chuoi = chuoi + name[x];
            } else {
              chuoi = chuoi + name[x] + "|";
            }
          }
          switch (se.slideData[i].rating) {
            case 50:
              se.slideData[i].rating = "./assets/star/ic_star_5.svg";
              break;
            case 45:
              se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
              break;
            case 40:
              se.slideData[i].rating = "./assets/star/ic_star_4.svg";
              break;
            case 35:
              se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
              break;
            case 30:
              se.slideData[i].rating = "./assets/star/ic_star_3.svg";
              break;
            case 25:
              se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
              break;
            case 20:
              se.slideData[i].rating = "./assets/star/ic_star_2.svg";
              break;
            case 15:
              se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
              break;
            case 10:
              se.slideData[i].rating = "./assets/star/ic_star.svg";
              break;
            case 5:
              se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
          var item = {
            ischecked: 0,
            id: se.slideData[i].id,
            name: name[0],
            imageUrl: se.slideData[i].images[0].url,
            regionName: se.slideData[i].regionName,
            minPrice: minPrice,
            description: chuoi,
            rating: se.slideData[i].rating,
            priceshow: (se.slideData[i].minPrice / 1000 > 1000) ? ((se.slideData[i].minPrice / 1000)
                .toLocaleString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
                .replace(",", ".") ) : 0
          };
          // if(!se.checkExistsItemInArray(se.slideData1,item,1)){
             se.slideData1.push(item);
          // }
        }
      }
      se.sl = se.slideData1.length;
      se.ischeck = true;
      se.canLoadDeal = true;
      if (se.myloader) {
        se.myloader.dismiss();
      }
    });
  }

  // getmood() {
  //   var se = this;
  //   var options = {
  //     method: "POST",
  //     url:
  //       C.urls.baseUrl.urlMobile +
  //       "/mobile/OliviaApis/Moods" +
  //       (se.memberid ? "?memberid=" + se.memberid : ""),
  //     timeout: 10000,
  //     maxAttempts: 5,
  //     retryDelay: 2000,
  //     headers: {
  //       "postman-token": "f0589249-bf19-001c-f359-9b33dcf6db86",
  //       "cache-control": "no-cache",
  //       apisecret: "2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU",
  //       apikey: "0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U"
  //     }
  //   };
  //   request(options, function(error, response, body) {
  //     if (response.statusCode != 200) {
  //       var objError = {
  //         page: "main",
  //         func: "getmood",
  //         message: response.statusMessage,
  //         content: response.body,
  //         param: JSON.stringify(options),
  //         type: "warning"
  //       };
  //       C.writeErrorLog(objError,response);
  //     }
  //     if (error) {
  //       error.page = "main";
  //       error.func = "getmood";
  //       error.param = JSON.stringify(options);
  //       C.writeErrorLog(error,response);
  //     }
  //     se.zone.run(() => {
  //       se.slideMood = JSON.parse(body);
  //       for (let i = 0; i < se.slideMood.length; i++) {
  //         var res = se.slideMood[i].avatar.substring(0, 4);
  //         if (res != "http") {
  //           se.slideMood[i].avatar = "https:" + se.slideMood[i].avatar;
  //         }
  //         // se.slideMood[i].bannerUrl = se.slideMood[i].bannerUrl.replace(".jpg", "-215x282.jpg");
  //         // se.slideMood[i].bannerUrl = se.slideMood[i].bannerUrl.replace(".png", "-215x282.png");
  //       }
  //       se.slmood = se.slideMood.length;
  //       //se.getNewsBlog();
  //     });
  //   });
  // }
  getmood() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/Moods' + (se.memberid ? '?memberid=' + se.memberid : ''),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        'postman-token': 'f0589249-bf19-001c-f359-9b33dcf6db86',
        'cache-control': 'no-cache',
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getmood",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError, response);
      }
      if (error) {
        error.page = "main";
        error.func = "getmood";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error, response);
      };
      se.zone.run(() => {
        se.slideMood = JSON.parse(body);

        se.storage.get('listtopmoods').then((data)=>{
          if(data){
            se.storage.remove('listtopmoods').then((datanew) =>{
              se.storage.set('listtopmoods', datanew);
            })
          }else{
            se.storage.set('listtopmoods', se.slideMood);
          }
        })
        se.loadMoods(se.slideMood);
        
      })
    });
  }

  loadMoods(listmoods){
    var se = this;
    se.slideMood =listmoods;
    for (let i = 0; i < listmoods.length; i++) {
      var res = listmoods[i].avatar.substring(0, 4);
      if (res != "http") {
        listmoods[i].avatar = 'https:' + listmoods[i].avatar;
      }
    }
    se.slmood = se.slideMood.length;
  }
  clickks() {
    this.ischeckks = true;
    this.ischeckvmb = false;
  }
  clickvmb() {
    this.ischeckks = false;
    this.ischeckvmb = true;
  }
  /**
   * Sự kiện khi chọn ngày trên datetimepicker checkin
   * @param selectdate ngày được chọn
   */
  selectcin(selectdate: Date) {
    var sdate = new Date(selectdate);
    this.datecin = new Date(selectdate);
    this.cin = moment(sdate).format("YYYY-MM-DD");
    this.cindisplay = moment(sdate).format("DD-MM-YYYY");
    //Set lại ngày checkout nếu chọn ngày checkin >= ngày checkout
    if (selectdate >= this.datecout) {
      var res = sdate.setTime(sdate.getTime() + 1 * 24 * 60 * 60 * 1000);
      var date = new Date(res);
      this.datecout = date;
      this.cout = moment(date).format("YYYY-MM-DD");
      this.coutdisplay = moment(sdate).format("DD-MM-YYYY");
      this.coutthu = moment(date).format("dddd");
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2";
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3";
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4";
          break;
        case "Thursday":
          this.coutthu = "Thứ 5";
          break;
        case "Friday":
          this.coutthu = "Thứ 6";
          break;
        case "Saturday":
          this.coutthu = "Thứ 7";
          break;
        default:
          this.coutthu = "Chủ nhật";
          break;
      }
    }
    //Set thứ theo ngày checkin được select
    this.cinthu = moment(selectdate).format("dddd");
    switch (this.cinthu) {
      case "Monday":
        this.cinthu = "Thứ 2";
        break;
      case "Tuesday":
        this.cinthu = "Thứ 3";
        break;
      case "Wednesday":
        this.cinthu = "Thứ 4";
        break;
      case "Thursday":
        this.cinthu = "Thứ 5";
        break;
      case "Friday":
        this.cinthu = "Thứ 6";
        break;
      case "Saturday":
        this.cinthu = "Thứ 7";
        break;
      default:
        this.cinthu = "Chủ nhật";
        break;
    }
    //Ẩn datepicker
    this.showCalCin = !this.showCalCin;
  }
  /**
   * Sự kiện khi chọn trên datetimepicker checkout
   * @param selectdate ngày check out
   */
  selectcout(selectdate: Date) {
    //Nếu ngày checkout > ngày checkin thì vào set lại biến ngày checkout
    if (selectdate > this.datecin) {
      this.datecout = new Date(selectdate);
      this.cout = moment(this.datecout).format("YYYY-MM-DD");
      this.coutdisplay = moment(this.datecout).format("DD-MM-YYYY");
      this.coutthu = moment(this.datecout).format("dddd");
      switch (this.coutthu) {
        case "Monday":
          this.coutthu = "Thứ 2";
          break;
        case "Tuesday":
          this.coutthu = "Thứ 3";
          break;
        case "Wednesday":
          this.coutthu = "Thứ 4";
          break;
        case "Thursday":
          this.coutthu = "Thứ 5";
          break;
        case "Friday":
          this.coutthu = "Thứ 6";
          break;
        case "Saturday":
          this.coutthu = "Thứ 7";
          break;
        default:
          this.coutthu = "Chủ nhật";
          break;
      }
      this.showCalCout = !this.showCalCout;
    }
  }
  selectclickcin() {
    this.cout = new Date(this.cin);
    var res = this.cout.setTime(this.cout.getTime() + 1 * 24 * 60 * 60 * 1000);
    var date = new Date(res);
    this.cout = moment(date).format("YYYY-MM-DD");
    this.cinthu = moment(this.cin).format("dddd");
    switch (this.cinthu) {
      case "Monday":
        this.cinthu = "Thứ 2";
        break;
      case "Tuesday":
        this.cinthu = "Thứ 3";
        break;
      case "Wednesday":
        this.cinthu = "Thứ 4";
        break;
      case "Thursday":
        this.cinthu = "Thứ 5";
        break;
      case "Friday":
        this.cinthu = "Thứ 6";
        break;
      case "Saturday":
        this.cinthu = "Thứ 7";
        break;
      default:
        this.cinthu = "Chủ nhật";
        break;
    }
  }
  selectclickcout() {
    var datecin = Date.parse(this.cin);
    var datecout = Date.parse(this.cout);
    this.coutthu = moment(datecout).format("dddd");
    switch (this.coutthu) {
      case "Monday":
        this.coutthu = "Thứ 2";
        break;
      case "Tuesday":
        this.coutthu = "Thứ 3";
        break;
      case "Wednesday":
        this.coutthu = "Thứ 4";
        break;
      case "Thursday":
        this.coutthu = "Thứ 5";
        break;
      case "Friday":
        this.coutthu = "Thứ 6";
        break;
      case "Saturday":
        this.coutthu = "Thứ 7";
        break;
      default:
        this.coutthu = "Chủ nhật";
        break;
    }
  }
  async presentToastwarming(msg) {
    const toast = await this.alertCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  openmnu() {
    this.hideStatusBar();
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.searchhotel.ChildAgeTo = 16;
    this.searchhotel.input = this.input;
    this.searchhotel.flag = this.co;
    this.searchhotel.chuoi = this.chuoi;
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    //Xóa clone page-searchhotel do push page
    this.gf.setParams(false, "requestcombo");
    this.navCtrl.navigateForward("/occupancy");
  }
  openmnu1() {
    this.hideStatusBar();
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.searchhotel.input = this.input;
    this.searchhotel.flag = this.co;
    this.searchhotel.chuoi = this.chuoi;
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    //this.presentLoadingnavi();
    //this.navCtrl.navigateForward('/searchhotelfilter');
    this.presentModal();
    this.gf.googleAnalytion(
      "mainpage",
      "Search",
      "" + this.input + "|" + this.chuoi + "|" + this.cin + "|" + this.cout
    );
  }

  async presentModal() {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: SearchHotelFilterPage,
      componentProps: {
        aParameter: true
      }
    });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.zone.run(() => {
        this.loaddata();
      });
    });
  }

  async presentLoading() {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: 1500
    });
    loader.present();
  }
  async presentLoadingnavi() {
    var loader = await this.loadingCtrl.create({
      id: '99',
      message: "",
      duration: 10
    });
    loader.present();
  }

  /**
   * Hàm bắt sự kiện click chọn ngày trên lịch bằng jquery
   * @param e biến event
   */
  async clickedElement(e: any) {
    var obj: any = e.currentTarget;
    if (
      $(obj.parentNode).hasClass("endSelection") ||
      $(obj.parentNode).hasClass("startSelection")
    ) {
      if (this.modalCtrl) {
        let fday: any;
        let tday: any;
        var monthenddate: any;
        var yearenddate: any;
        var monthstartdate: any;
        var yearstartdate: any;
        var objTextMonthEndDate: any;
        var objTextMonthStartDate: any;

        this.cofdate = 0;
        this.cotdate = 0;
        this.cinthu = "";
        this.coutthu = "";
        if ($(obj.parentNode).hasClass('endSelection')) {
          // fday = $('.on-selected')[0].textContent;
          // tday = $(obj)[0].textContent;
          if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
          } else {
            fday = $('.on-selected')[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText; 
          } else {
            tday = $(obj)[0].textContent;
          }
          objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
        } else {
          if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
            fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText
          }
          else{
            fday = $(obj)[0].textContent;
          }
          if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
            tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
          }
          else{
            tday = $('.endSelection').children('.days-btn')[0].textContent;
          }
          objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
          objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
        }

        if (
          objTextMonthEndDate &&
          objTextMonthEndDate.length > 0 &&
          objTextMonthStartDate &&
          objTextMonthStartDate.length > 0
        ) {
          monthstartdate = objTextMonthStartDate.split("/")[0];
          yearstartdate = objTextMonthStartDate.split("/")[1];
          monthenddate = objTextMonthEndDate.split("/")[0];
          yearenddate = objTextMonthEndDate.split("/")[1];
          var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
          var todate = new Date(yearenddate, monthenddate - 1, tday);
          if (fromdate && todate && moment(todate).diff(fromdate, "days") > 0) {
            var se = this;
            setTimeout(() => {
              se.modalCtrl.dismiss();
            }, 300);

            se.cin = moment(fromdate).format("YYYY-MM-DD");
            se.cout = moment(todate).format("YYYY-MM-DD");
            se.zone.run(() => {
              se.searchhotel.CheckInDate = se.cin;
              se.searchhotel.CheckOutDate = se.cout;
              se.datecin = new Date(se.cin);
              se.datecout = new Date(se.cout);
              se.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
              se.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
              se.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
              se.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
              //se.getDayName(se.datecin, se.datecout);
              //xử lý âm lịch
              this.bindlunar();
            });
          }
        }
      }
    }
  }

  async openPickupCalendar() {
    this.hideStatusBar();
    //this.navCtrl.navigateForward('/pickup-calendar/true');
    let fromdate = new Date(this.cin);
    let todate = new Date(this.cout);
    let _daysConfig: DayConfig[] = [];
    for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
      _daysConfig.push({
        date: this.valueGlobal.listlunar[j].date,
        subTitle: this.valueGlobal.listlunar[j].name,
        cssClass: 'lunarcalendar'
      })
    }
    const options: CalendarModalOptions = {
      pickMode: "range",
      title: "Chọn ngày",
      monthFormat: "MM / YYYY",
      weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      closeLabel: "Thoát",
      doneLabel: "",
      step: 0,
      defaultScrollTo: fromdate,
      defaultDateRange: { from: fromdate, to: todate },
      daysConfig: _daysConfig
    };

    this.myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      animated: true,
      componentProps: { options }
    });

    this.myCalendar.present().then(() => {
      $(".days-btn").click(e => this.clickedElement(e));
    });
    var se = this;
    const event: any = await this.myCalendar.onDidDismiss();
    const date = event.data;
    if (event.data) {
      const from: CalendarResult = date.from;
      const to: CalendarResult = date.to;
      se.cin = moment(from.dateObj).format("YYYY-MM-DD");
      se.cout = moment(to.dateObj).format("YYYY-MM-DD");
      se.zone.run(() => {
        se.searchhotel.CheckInDate = se.cin;
        se.searchhotel.CheckOutDate = se.cout;
        se.datecin = new Date(se.cin);
        se.datecout = new Date(se.cout);
        se.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
        se.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
        se.cindisplay = moment(se.datecin).format("DD-MM-YYYY");
        se.coutdisplay = moment(se.datecout).format("DD-MM-YYYY");
        se.getDayName(se.datecin, se.datecout);
      });
    }
  }
  // getNewsBlog() {
  //   var se = this;

  //   var options = {
  //     method: 'GET',
  //     url: C.urls.baseUrl.urlBlog +'/GetNewsBlog?pageIndex='+se.pageBlog+'&pageSize='+se.pageSizeBlog+ (se.memberid ? '&memberid='+se.memberid : ''),
  //     timeout: 10000, maxAttempts: 5, retryDelay: 2000,
  //     headers:
  //     {
  //     }
  //   };
  //   request(options, function (error, response, body) {
  //     if(response.statusCode != 200){
  //       var objError ={
  //           page: "main",
  //           func: "getNewsBlog",
  //           message : response.statusMessage,
  //           content : response.body,
  //           param: JSON.stringify(options),
  //           type: "warning"
  //         };
  //       C.writeErrorLog(objError,response);
  //     }
  //     if (error) {
  //       error.page = "main";
  //       error.func = "getNewsBlog";
  //       error.param = JSON.stringify(options),
  //       C.writeErrorLog(error,response);
  //     }
  //     se.zone.run(() => {
  //       var listBlog = JSON.parse(body);
  //       se.showloadmoreblog = listBlog.length ==0 ? false : true;
  //       for (let i = 0; i < listBlog.length; i++) {
  //         listBlog[i].Date = moment(listBlog[i].Date).format('DD/MM/YYYY');
  //       }
  //       //PDANH 10/06/2019: Thêm kiểm tra trùng item
  //       if(!se.checkExistsItemInArray(se.blog,listBlog[0],4 ) ){
  //         se.blog.push(...listBlog);
  //       }else{
  //         se.showloadmoreblog = false;
  //       }

  //     })

  //   });

  // }
  getNewsBlog(value) {
    var se = this;
    se.canLoadBlog = false;
    var options = {
      method: "GET",
      url:
        C.urls.baseUrl.urlBlog +
        "/GetNewsBlog?pageIndex=" +
        se.pageBlog +
        "&pageSize=" +
        se.pageSizeBlog +
        (se.memberid ? "&memberid=" + se.memberid : ""),
      timeout: 10000,
      maxAttempts: 5,
      retryDelay: 2000,
      headers: {}
    };
    request(options, function(error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getNewsBlog",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "main";
        error.func = "getNewsBlog";
        (error.param = JSON.stringify(options)), C.writeErrorLog(error,response);
      }
      se.zone.run(() => {
        var listBlogtemp = JSON.parse(body);
        se.listBlog = [];
        se.showloadmoreblog = listBlogtemp.length == 0 ? false : true;
        for (let i = 0; i < listBlogtemp.length; i++) {
          listBlogtemp[i].Date = moment(listBlogtemp[i].Date).format(
            "DD/MM/YYYY"
          );
        }
        if (se.arrbloglike && se.arrbloglike.length > 0) {
          var itemblog;
          for (let i = 0; i < listBlogtemp.length; i++) {
            itemblog = {
              Avatar: listBlogtemp[i].Avatar,
              Date: listBlogtemp[i].Date,
              Id: listBlogtemp[i].id,
              Title: listBlogtemp[i].Title,
              Url: listBlogtemp[i].Url,
              Like: false
            };
            for (let j = 0; j < se.arrbloglike.length; j++) {
              if (se.arrbloglike[j].id == listBlogtemp[i].id) {
                itemblog = {
                  Avatar: listBlogtemp[i].Avatar,
                  Date: listBlogtemp[i].Date,
                  Id: listBlogtemp[i].id,
                  Title: listBlogtemp[i].Title,
                  Url: listBlogtemp[i].Url,
                  Like: true
                };
                break;
              }
            }
            se.listBlog.push(itemblog);
          }
        } else {
          for (let i = 0; i < listBlogtemp.length; i++) {
            itemblog = {
              Avatar: listBlogtemp[i].Avatar,
              Date: listBlogtemp[i].Date,
              Id: listBlogtemp[i].id,
              Title: listBlogtemp[i].Title,
              Url: listBlogtemp[i].Url,
              Like: false
            };
            se.listBlog.push(itemblog);
          }
        }
        if (!se.checkExistsItemInArray(se.blog, listBlogtemp[0], 4)) {
          se.blog.push(...se.listBlog);
          se.canLoadBlog = true;
        } else {
          if (value == 1) {
            for (let i = 0; i < se.blog.length; i++) {
              se.blog[i].Like = false;
            }
          }
          se.showloadmoreblog = false;
        }
        se.storage.set("listblogdefault", se.blog);
        if (value == 0) {
          se.getblogtrips();
        }
        //unlike item khi logout account
        se.storage.get("auth_token").then(auth_token => {
          if (!auth_token) {
              se.bindItemunLike();
            }
          })
      });
    });
  }

  clickitemblog(item) {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.valueGlobal.urlblog = item.Url;
    this.valueGlobal.backValue = "blog";
    this.valueGlobal.logingoback = "/blog/" + item.Id;
    this.navCtrl.navigateForward("/blog/" + item.Id);
    // var url = item.Url;
    // this.openWebpage(url);
    //google analytic
    this.gf.googleAnalytion("main", "Search", "blog");
    this.hideStatusBar();
  }
  clickitemblogmain() {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    var url = "https://www.ivivu.com/blog";
    this.openWebpage(url);
    //google analytic
    this.gf.googleAnalytion("main", "Search", "blog");
    this.hideStatusBar();
  }
  openWebpage(url: string) {
    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {
        this.safariViewController
          .show({
            url: url,
            hidden: false,
            animated: true,
            transition: "curl",
            enterReaderModeIfAvailable: true,
            tintColor: "#ff0000"
          })
          .subscribe(
            (result: any) => {
              if (result.event === "opened") console.log("Opened");
              else if (result.event === "loaded") console.log("Loaded");
              else if (result.event === "closed") console.log("Closed");
            },
            (error: any) => console.error(error)
          );
      } else {
        // use fallback browser, example InAppBrowser
      }
    });
  }
  getItems(ev: any) {
    // Reset items back to all of the items

    if (this.input) {
      this.ischeckclose = true;
      var se = this;
      const val = ev.target.value;

      var options = {
        method: "GET",
        url: "https://www.ivivu.com/GListSuggestion",
        timeout: 10000,
        maxAttempts: 5,
        retryDelay: 2000,
        qs: { key: val },
        headers: {}
      };

      request(options, function(error, response, body) {
        if (response.statusCode != 200) {
          var objError = {
            page: "main",
            func: "getItems",
            message: response.statusMessage,
            content: response.body,
            param: JSON.stringify(options),
            type: "warning"
          };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page = "main";
          error.func = "getItems";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        }
        se.zone.run(() => {
          se.items = JSON.parse(body);
          if (val && val.trim() != "") {
            se.items;
            se.ischecklist = true;
          } else {
            se.items = [];
            se.ischecklist = false;
          }
        });
      });
    } else {
      this.ischeckclose = false;
      this.ischecklist = false;
    }
    //google analytic
    this.gf.googleAnalytion("main", "searchregion", "");
  }
  change() {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.storage.get("listregion").then((data: any) => {
      if (!data) {
        this.presentLoadingnavi();
      }
    });

    if (this.input) {
      this.ischeckclose = true;
    }
    this.recent = this.searchhotel.recent;
    this.navCtrl.navigateForward("/searchhotel");
    //this.gf.googleAnalytion('main','Search', 'searchrecent:'+this.input+'/cin:'+this.cin + '/cout:'+this.cout );
  }

  clearClonePage(pagename) {
    //Xóa clone do push page
    let elements = [];
    elements = Array.from(document.querySelectorAll(pagename));
    if (elements != null && elements.length > 0) {
      elements.forEach(el => {
        if (el && el != null) {
          //if (el != null && el.length > 0) {
          el.remove();
        }
      });
    }
  }
  itemclick(item) {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.gbitem = item;
    if (item.HotelName) {
      this.input = item.HotelName;
    } else {
      this.input = item.RegionName;
    }
    this.ischeckclose = false;
    // this.isenabled = false
    // this.showpopup = false;
    this.ischecksearch = false;
    this.co = 0;
    //this.content.scrollToTop(50);
    //google analytic
    this.gf.googleAnalytion(
      "main",
      "Search",
      "" + this.input + "|" + this.cin + "|" + this.cout
    );
  }
  next1(msg) {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.gbmsg = msg;
    this.ischeckclose = false;
    this.searchhotel.gbmsg = msg;
    this.ischecksearch = false;
    if (msg.regionName) {
      this.input = msg.regionName;
    } else {
      this.input = msg.HotelName;
    }
    this.isenabled = false;
    this.co = 2;
    //this.content.scrollToTop(50);
    //this.authService.region=name;
    //this.navCtrl.push('HotelListPage');
    this.gf.googleAnalytion(
      "main",
      "Search",
      "" + this.input + "|" + this.cin + "|" + this.cout
    );
  }

  close() {
    this.ischecksearch = false;
    if (!this.input) {
      this.isenabled = true;
    }
  }
  next(msg, i) {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    this.ischeckclose = false;
    this.gbmsg = msg;
    this.searchhotel.gbmsg = msg;
    this.ischecksearch = false;
    this.index = i;

    this.input = msg.regionName;

    this.isenabled = false;
    this.co = 1;
    //this.content.scrollToTop(50);
    //this.authService.region=name;
    //this.navCtrl.push('HotelListPage');
    this.gf.googleAnalytion(
      "main",
      "Search",
      "" + this.input + "|" + this.cin + "|" + this.cout
    );
  }
  getdata() {
    var se = this;
    var options = {
      method: "GET",
      url:
        C.urls.baseUrl.urlMobile +
        "/mobile/OliviaApis/Regions" +
        (se.memberid ? "?memberid=" + se.memberid : ""),
      headers: {
        apisecret: "2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU",
        apikey: "0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U"
      }
    };
    request(options, function(error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getdata",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "main";
        error.func = "getdata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
      }
      se.json = JSON.parse(body);
      se.getRegions();
    });
  }
  search() {
    if (!this.isConnected) {
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
      return;
    }
    //this.presentLoadingnavi();
    this.searchhotel.backPage = "";
    if (this.input) {
      this.searchhotel.chuoi = this.chuoi;
      this.searchhotel.CheckInDate = this.cin;
      this.searchhotel.CheckOutDate = this.cout;
      this.searchhotel.child = this.child;
      this.searchhotel.adult = this.adult;
      this.searchhotel.input = this.input;

      var se = this;
      if (this.co == 1) {
        this.authService.region = this.gbmsg.regionName;
        this.authService.regionid = this.gbmsg.regionId;
        this.authService.regioncode = this.gbmsg.regionCode;
        if (this.recent) {
          var cocheck = 0;
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].RegionId == this.gbmsg.regionId) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item1 = {
              Type: "2",
              HotelId: "",
              HotelName: "",
              RegionId: this.gbmsg.regionId,
              RegionCode: this.gbmsg.regionCode,
              regionName: this.gbmsg.regionName,
              flag: "1",
              TotalHotels: this.gbmsg.totalHotel
            };
            se.searchhotel.recent = [];

            if (this.recent.length > 1) {
              se.searchhotel.recent.push(this.recent[1]);
            } else {
              se.searchhotel.recent.push(this.recent[0]);
            }
            se.searchhotel.recent.push(item1);
            se.isrefreshlist = "true";
          }
        } else {
          var item1 = {
            Type: "2",
            HotelId: "",
            HotelName: "",
            RegionId: this.gbmsg.regionId,
            RegionCode: this.gbmsg.regionCode,
            regionName: this.gbmsg.regionName,
            flag: "1",
            TotalHotels: this.gbmsg.totalHotel
          };
          se.searchhotel.recent = [];
          se.searchhotel.recent.push(item1);
        }
        //Xóa clone page-hotel-list do push page
        this.valueGlobal.logingoback='/app/tabs/hotellist/true';
        this.navCtrl.navigateForward('/hotellist/' + se.isrefreshlist);
        //this.navCtrl.navigateForward("/app/tabs/hotellist/true");
        this.gf.googleAnalytion(
          "main",
          "Search",
          this.authService.regioncode +
            "|" +
            this.input +
            "|" +
            this.cin +
            "|" +
            this.cout
        );
      } else if (this.co == 0) {
        if (this.gbitem.Type == 1) {
          var id1 = { id: this.gbitem.HotelId };
          if (this.recent) {
            var cocheck = 0;
            for (let i = 0; i < this.recent.length; i++) {
              var temp = this.recent[i].HotelId;
              if (temp == id1.id) {
                cocheck = 1;
                break;
              }
            }
            if (cocheck == 0) {
              var item2 = {
                Type: "1",
                HotelId: this.gbitem.HotelId,
                HotelName: this.gbitem.HotelName,
                RegionId: "",
                RegionCode: "",
                regionName: "",
                flag: "0",
                TotalHotels: ""
              };
              se.searchhotel.recent = [];

              if (this.recent.length > 1) {
                se.searchhotel.recent.push(this.recent[1]);
              } else {
                se.searchhotel.recent.push(this.recent[0]);
              }
              this.searchhotel.recent.push(item2);
              se.isrefreshlist = "true";
            }
          } else {
            var item2 = {
              Type: "1",
              HotelId: this.gbitem.HotelId,
              HotelName: this.gbitem.HotelName,
              RegionId: "",
              RegionCode: "",
              regionName: "",
              flag: "0",
              TotalHotels: ""
            };
            se.searchhotel.recent = [];

            this.searchhotel.recent.push(item2);
          }
          this.searchhotel.rootPage = "mainpage";
          //this.navCtrl.navigateForward('/hoteldetail/'+this.gbitem.HotelId);
          this.valueGlobal.logingoback= "/hoteldetail/" + se.gbitem.HotelId;
          se.navCtrl.navigateForward('/hoteldetail/'+ se.gbitem.HotelId);
          // this.navCtrl.navigateForward(
          //   "/app/tabs/hoteldetail/" + this.gbitem.HotelId
          // );
          this.gf.googleAnalytion(
            "main",
            "Search",
            this.input +
              "|" +
              this.cin +
              "|" +
              this.cout +
              "|" +
              this.gbitem.HotelId +
              "|" +
              this.gbitem.HotelName
          );
        } else {
          if (this.recent) {
            var cocheck = 0;
            for (let i = 0; i < this.recent.length; i++) {
              if (this.recent[i].RegionId == this.gbitem.RegionId) {
                cocheck = 1;
                break;
              }
            }
            if (cocheck == 0) {
              var item3 = {
                Type: "2",
                HotelId: "",
                HotelName: "",
                RegionId: this.gbitem.RegionId,
                RegionCode: this.gbitem.RegionCode,
                regionName: this.gbitem.RegionName,
                flag: "0",
                TotalHotels: this.gbitem.TotalHotels
              };
              se.searchhotel.recent = [];

              if (this.recent.length > 1) {
                se.searchhotel.recent.push(this.recent[1]);
              } else {
                se.searchhotel.recent.push(this.recent[0]);
              }
              this.searchhotel.recent.push(item3);
              se.isrefreshlist = "true";
            }
          } else {
            var item3 = {
              Type: "2",
              HotelId: "",
              HotelName: "",
              RegionId: this.gbitem.RegionId,
              RegionCode: this.gbitem.RegionCode,
              regionName: this.gbitem.RegionName,
              flag: "0",
              TotalHotels: this.gbitem.TotalHotels
            };
            se.searchhotel.recent = [];
            this.searchhotel.recent.push(item3);
          }

          this.authService.region = this.gbitem.RegionName;
          this.authService.regionid = this.gbitem.RegionId;
          this.authService.regioncode = this.gbitem.RegionCode;
          var obj = {
            regionName: this.authService.region,
            regionId: this.authService.regionid,
            regionCode: this.authService.regioncode
          };
          this.searchhotel.gbmsg = obj;
          this.valueGlobal.logingoback="/hotellist/false";
          //this.navCtrl.navigateForward("/app/tabs/hotellist/false");
          this.navCtrl.navigateForward('/hotellist/' + se.isrefreshlist);
          this.gf.googleAnalytion(
            "main",
            "Search",
            this.authService.regioncode +
              "|" +
              this.input +
              "|" +
              this.cin +
              "|" +
              this.cout +
              "|" +
              this.gbitem.RegionCode
          );
        }
      } else if (this.co == 2) {
        if (this.gbmsg.Type == 1) {
          var id1 = { id: this.gbmsg.HotelId };
          this.searchhotel.rootPage = "mainpage";
          this.searchhotel.gbitem.HotelId = this.gbmsg.HotelId;
          this.valueGlobal.logingoback="/hoteldetail/" + id1;
          this.navCtrl.navigateForward("/hoteldetail/" + id1);
          this.gf.googleAnalytion(
            "main",
            "Search",
            this.input +
              "|" +
              this.cin +
              "|" +
              this.cout +
              "|" +
              this.gbitem.HotelId
          );
        } else {
          this.authService.region = this.gbmsg.regionName;
          this.authService.regionid = this.gbmsg.RegionId;
          this.authService.regioncode = this.gbmsg.RegionCode;
          //this.navCtrl.navigateForward("/app/tabs/hotellist/false");
          var cocheck = 0;
            for (let i = 0; i < this.recent.length; i++) {
              if (this.recent[i].RegionId == this.gbmsg.RegionId) {
                cocheck = 1;
                break;
              }
            }
            if (cocheck == 0) {
              se.isrefreshlist = "true";
            }
          this.navCtrl.navigateForward("/hotellist/" + se.isrefreshlist);
          this.gf.googleAnalytion(
            "main",
            "Search",
            this.authService.regioncode +
              "|" +
              this.input +
              "|" +
              this.cin +
              "|" +
              this.cout +
              "|" +
              this.gbmsg.RegionCode
          );
        }
      } else if (this.input && !this.co) {
        this.input = "";
        this.navCtrl.navigateForward("/searchhotel");
      }
    } else {
      this.navCtrl.navigateForward("/searchhotel");
      this.gf.googleAnalytion("main", "Search", "");
    }
  }
  deletetext() {
    this.input = "";
    this.ischeckclose = false;
    this.ischecklist = false;
  }

  ionViewDidLoad() {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map(key => {
        elements[key].style.display = "flex";
      });
    }
  }

  hideStatusBar(){
    var se = this;
    let el = document.getElementsByClassName('div-statusbar-float');
      el[0].classList.remove('float-statusbar-enabled');
      el[0].classList.add('float-statusbar-disabled');
  }

  ionViewWillEnter() {
    this.valueGlobal.logingoback = '/app/tabs/tab1';
    if (document.querySelector(".tabbar")) {
      document.querySelector(".tabbar")["style"].display = "flex";
    }
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
    } else {
      this.isConnected = false;
      this.gf.showWarning(
        "Không có kết nối mạng",
        "Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng",
        "Đóng"
      );
    }
  }

  itemclickht(item) {
    //this.presentLoadingnavi();
    this.hideStatusBar();
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    this.searchhotel.hotelID = item.id;
    this.searchhotel.rootPage = "topdeal";
    //this.navCtrl.navigateForward('/hoteldetail/'+item.id);
    this.valueGlobal.logingoback="/hoteldetail/" + item.id;
    setTimeout(()=>{
      //this.navCtrl.navigateForward("/app/tabs/hoteldetail/" + item.id);
      this.navCtrl.navigateForward('/hoteldetail/'+ item.id);
    },10)
    
    //google analytic
  }
  itemSelectedmood(item) {
    this.valueGlobal.logingoback='/hotellistmood/' + item.id + '/' + item.title;
    //this.presentLoadingnavi();
    var id1 = { id: item.id, title: item.title };
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    //this.navCtrl.navigateForward('hotellistmood/'+item.id+'/'+item.title);
    setTimeout(()=>{
      // this.navCtrl.navigateForward(
      //   "/app/tabs/hotellistmood/" + item.id + "/" + item.title
      // );
      this.navCtrl.navigateForward("/hotellistmood/" + item.id + "/" + item.title);
    },10)
    this.hideStatusBar();
    //google analytic
    this.gf.googleAnalytion("hotellistmood", "Search", item.title);
  }

  /**
   * Chuyển sang hotel list theo id vùng
   * @param item //item vùng
   */
  itemclickregion(item) {
    //this.presentLoadingnavi();
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    this.searchhotel.child = this.child;
    this.searchhotel.adult = this.adult;
    this.searchhotel.roomnumber = this.roomnumber;
    this.searchhotel.rootPage = "topregion";
    this.authService.region = item.name;
    this.authService.regionid = item.id;
    this.authService.regioncode = item.regionCode;
    this.searchhotel.location = "";
    this.searchhotel.chuoi = this.chuoi;
    this.zone.run(() => {
      this.input = item.name;
      this.searchhotel.input = item.name;
    });
    //clear local
    this.searchhotel.local0check = false;
    this.searchhotel.local1check = false;
    this.searchhotel.local2check = false;
    this.searchhotel.local3check = false;
    this.searchhotel.local4check = false;
    this.searchhotel.local5check = false;
    this.searchhotel.local6check = false;
    this.searchhotel.local7check = false;
    this.searchhotel.local8check = false;
    this.searchhotel.local9check = false;
    this.searchhotel.local10check = false;
    this.searchhotel.local11check = false;
    this.searchhotel.local12check = false;
    this.searchhotel.local13check = false;
    this.searchhotel.local14check = false;
    this.searchhotel.local15check = false;
    this.searchhotel.local16check = false;
    this.searchhotel.local17check = false;
    this.searchhotel.local18check = false;
    this.searchhotel.local19check = false;
    this.searchhotel.location = "";
    var obj = {
      regionName: this.authService.region,
      regionId: this.authService.regionid,
      regionCode: this.authService.regioncode
    };
    this.searchhotel.gbmsg = obj;
    this.searchhotel.flag = 1;
    //this.navCtrl.navigateForward('/hotellist/true');
    this.valueGlobal.logingoback="/hotellist/true";
    //this.navCtrl.navigateForward("/app/tabs/hotellist/true");
    this.navCtrl.navigateForward("/hotellist/true");
    this.hideStatusBar();
    //google analytic
    this.gf.googleAnalytion(
      "main",
      "Search",
      "topregion:" + this.authService.regioncode
    );
  }

  /**
   * Hàm bắt sự kiện loadmore khi scroll trên topdeal
   * @param event biến event
   */
  onScroll(event: any) {
    let scrolled = 0;
    let el: any = document.getElementsByClassName("slide2-scroll");
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfinite();
      }, 500);
    }
  }

  /**
   * Hàm gọi load topdeal
   */
  doInfinite() {
    this.zone.run(() => {
      if (this.ischeck == true && this.canLoadDeal) {
        this.page = this.page + 1;
        this.getHotelDealPaging();
      }
    });
  }

  /**
   * Sự kiện loadmore khi scroll blog
   * @param event biến event
   */
  onScrollBlog(event: any) {
    let scrolled = 0;
    let el: any = document.getElementsByClassName("slide5-scroll");
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfiniteBlog();
      }, 500);
    }
  }

  /**
   * Sự kiện loadmore khi scroll blog trip suggest
   * @param event biến event
   */
  onScrollBlogTrip(event: any) {
    let scrolled = 0;
    let el: any = document.getElementsByClassName("slideblogtrips-scroll");
    if (el.length > 0) {
      scrolled = Math.round(el[0].scrollWidth - el[0].scrollLeft);
    }
    if (scrolled == el[0].offsetWidth || scrolled + 1 == el[0].offsetWidth) {
      setTimeout(() => {
        this.doInfiniteBlogTrip();
      }, 500);
    }
  }

  /**
   * Hàm gọi loadpaging topdeal
   */
  doInfiniteBlog() {
    this.zone.run(() => {
      if (this.ischeck == true) {
        this.pageBlog = this.pageBlog + 1;
        this.getNewsBlog(0);
      }
    });
  }

  /**
   * Hàm gọi loadpaging topdeal
   */
  doInfiniteBlogTrip() {
    this.zone.run(() => {
      if (this.ischeck == true) {
        this.pageBlogTrip = this.pageBlogTrip + 1;
        this.getblogtrips();
      }
    });
  }

  getblogtrips() {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: "GET",
          url:
            C.urls.baseUrl.urlMobile +
            "/mobile/OliviaApis/GeBlogByTripLatestOfUser" +
            "?pageIndex=" +
            se.pageBlogTrip +
            "&pageSize=10",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/json",
            authorization: text
          }
        };
        request(options, function(error, response, body) {
          if (error) {
            error.page = "hotellike";
            error.func = "getblog";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            throw new Error(error);
          }
          se.zone.run(() => {
            var data = JSON.parse(body);
            var listBlogtemp = data.items;
            // if (listBlogtemp.error) {
            //   se.blogtrips=[];
            // }
            if (listBlogtemp && listBlogtemp.length > 0) {
              se.regionnamesuggest = data.regionName;
              if (se.arrbloglike && se.arrbloglike.length > 0) {
                var itemblog;
                for (let i = 0; i < listBlogtemp.length; i++) {
                  itemblog = {
                    avatar: listBlogtemp[i].avatar,
                    date: listBlogtemp[i].Date,
                    id: listBlogtemp[i].id,
                    title: listBlogtemp[i].title,
                    url: listBlogtemp[i].url,
                    Like: false
                  };
                  for (let j = 0; j < se.arrbloglike.length; j++) {
                    if (se.arrbloglike[j].id == listBlogtemp[i].Id) {
                      itemblog = {
                        avatar: listBlogtemp[i].avatar,
                        date: listBlogtemp[i].date,
                        id: listBlogtemp[i].id,
                        title: listBlogtemp[i].title,
                        url: listBlogtemp[i].url,
                        Like: true
                      };
                      break;
                    }
                  }
                  if (!se.checkExistsItemInArray(se.blogtrips, itemblog, 1)) {
                    se.blogtrips.push(itemblog);
                  }
                }
              } else {
                for (let i = 0; i < listBlogtemp.length; i++) {
                  itemblog = {
                    avatar: listBlogtemp[i].avatar,
                    date: listBlogtemp[i].date,
                    id: listBlogtemp[i].id,
                    title: listBlogtemp[i].title,
                    url: listBlogtemp[i].url,
                    Like: false
                  };
                  if (!se.checkExistsItemInArray(se.blogtrips, itemblog, 1)) {
                    se.blogtrips.push(itemblog);
                  }
                }
              }

              if (se.arrbloglike && se.arrbloglike.length > 0) {
                se.bindItemLiketrips(se.arrbloglike);
              }

              se.storage.set("listblogtripdefault", se.blogtrips);
              se.storage.set("regionnamesuggest", data.regionName);
            } else {
              se.showloadmoreblogtrip = false;
            }
            //
          });
        });
      } else {
        se.blogtrips = [];
        se.showloadmoreblogtrip = false;
      }
    });
  }
  bindItemunLike()
  {
    if (this.blog.length>0) {
      this.zone.run(() => {
        for (let i = 0; i < this.blog.length; i++) {
          this.blog[i].Like = false;
        }
      });
     
    }
  }
  bindItemLike(listLike) {
    var se = this;
    if (listLike.length > 0) {
      se.blog.forEach(element => {
        if (listLike && listLike.length > 0) {
          var itemlikemap = listLike.filter(item => {
            return item.id == element.Id;
          });
          if (itemlikemap && itemlikemap.length > 0) {
            se.zone.run(() => {
              element.Like = true;
            });
          } else {
            se.zone.run(() => {
              element.Like = false;
            });
          }
        }
      });
    } else {
      for (let i = 0; i < se.blog.length; i++) {
        se.blog[i].Like = false;
      }
    }

    if (se.blogtrips && se.blogtrips.length > 0) {
      this.bindItemLiketrips(se.arrbloglike);
    } else {
      this.getblogtrips();
    }
  }
  bindItemLiketrips(listLike) {
    var se = this;
    if (listLike && listLike.length > 0) {
      se.blogtrips.forEach(element => {
        var itemlikemap = listLike.filter(item => {
          return item.id == element.id;
        });
        if (itemlikemap && itemlikemap.length > 0) {
          se.zone.run(() => {
            element.Like = true;
          });
        } else {
          se.zone.run(() => {
            element.Like = false;
          });
        }
      });
    } else {
      for (let i = 0; i < se.blogtrips.length; i++) {
        se.blogtrips[i].Like = false;
      }
    }
  }

  getbloglike(value) {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: "GET",
          url:
            C.urls.baseUrl.urlMobile +
            "/mobile/OliviaApis/GetFavouriteBlogByUser",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/json",
            authorization: text
          }
        };
        request(options, function(error, response, body) {
          if (error) {
            error.page = "hotellike";
            error.func = "getblog";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            throw new Error(error);
          }
          se.zone.run(() => {
            se.arrbloglike = JSON.parse(body);
            if (se.arrbloglike.msg) {
              se.arrbloglike = [];
            }
            if (value == 0) {
              se.getNewsBlog(0);
              se.storage.get('blogtripdefault').then(data => {
                if(data){
                  se.blogtrips = data;
                }else{
                  se.getblogtrips();
                }
              })
              
            } else {
              se.bindItemLike(se.arrbloglike);
            }
          });
        });
      } else {
        se.arrbloglike = [];
        se.getNewsBlog(1);
      }
    });
  }
  seemoreblog(value) {
    //this.presentLoadingNavigate();
    this.gf.setParams(value, "seemoreblog");
    this.valueGlobal.backValue = "blog";
    this.valueGlobal.logingoback='bloglist';
    //setTimeout(()=>{
      this.navCtrl.navigateForward("/bloglist");
    //},250)
    this.hideStatusBar();
  }
  itemblog(item) {
    this.valueGlobal.urlblog = item.Url;
    this.valueGlobal.logingoback = '/blog/' + item.Id;
    this.navCtrl.navigateForward("/blog/" + item.Id);
    //google analytic
    this.gf.googleAnalytion("blog", "Search", "");
    this.hideStatusBar();
  }
  clickitemblogtrips(item) {
    this.valueGlobal.urlblog = item.url;
    this.valueGlobal.backValue = "blog";
    this.valueGlobal.logingoback = '/blog/' + item.id;
    this.navCtrl.navigateForward("/blog/" + item.id);
    //google analytic
    this.gf.googleAnalytion("blog", "Search", "");
    this.hideStatusBar();
  }
  share(url) {
    this.socialSharing
      .share(null, null, null, url)
      .then(() => {
        // Success!
      })
      .catch(() => {
        // Error!
      });
  }
  likeItemblog(id) {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        se.getbloglikelocal(id, 1);
        var text = "Bearer " + auth_token;
        var options = {
          method: "POST",
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
          url: C.urls.baseUrl.urlMobile + "/mobile/OliviaApis/AddFavouriteBlog",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function(error, response, body) {
          if (error) {
            error.page = "mainpage";
            error.func = "likeItemblog";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          }
          if (se.valueGlobal.blogid) {
            se.getbloglike(1);
            se.valueGlobal.blogid=null;
          }
          // se.zone.run(() => se.getbloglike(1));
        });
      } else {
        //se.valueGlobal.logingoback = "TabPage";
        se.valueGlobal.logingoback = '/app/tabs/tab1';
        se.valueGlobal.blogid=id;
        let el = document.getElementsByClassName('div-statusbar-float');
        if(el.length >0){
              el[0].classList.remove('float-statusbar-enabled');
              el[0].classList.add('float-statusbar-disabled');
          }
        se.navCtrl.navigateForward("/login");
      }
    });
  }
  likeItemblogtrips(id) {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        se.getbloglikelocaltrips(id, 1);
        var text = "Bearer " + auth_token;
        var options = {
          method: "POST",
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
          url: C.urls.baseUrl.urlMobile + "/mobile/OliviaApis/AddFavouriteBlog",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function(error, response, body) {
          if (error) {
            error.page = "mainpage";
            error.func = "likeItemblogtrips";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          }
          // se.zone.run(() => se.getbloglike(1));
        });
      } else {
        //se.valueGlobal.logingoback = "TabPage";
        se.navCtrl.navigateForward("/login");
      }
    });
  }
  unlikeItemblog(id) {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        se.getbloglikelocal(id, 0);
        var text = "Bearer " + auth_token;
        var options = {
          method: "POST",
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/RemoveFavouriteHotelByUser',
          url:
            C.urls.baseUrl.urlMobile +
            "/mobile/OliviaApis/RemoveFavouriteBlogByUser",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function(error, response, body) {
          if (error) {
            error.page = "mainpage";
            error.func = "unlikeItemblog";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          }
          // se.zone.run(() => se.getbloglike(1));

          // console.log(body);
        });
      } else {
        this.navCtrl.navigateForward("/login");
      }
    });
  }
  unlikeItemblogtrips(id) {
    var se = this;
    se.storage.get("auth_token").then(auth_token => {
      if (auth_token) {
        se.getbloglikelocaltrips(id, 0);
        var text = "Bearer " + auth_token;
        var options = {
          method: "POST",
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/RemoveFavouriteHotelByUser',
          url:
            C.urls.baseUrl.urlMobile +
            "/mobile/OliviaApis/RemoveFavouriteBlogByUser",
          timeout: 10000,
          maxAttempts: 5,
          retryDelay: 2000,
          headers: {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function(error, response, body) {
          if (error) {
            error.page = "mainpage";
            error.func = "unlikeItemblogtrips";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          }
        });
      } else {
        this.navCtrl.navigateForward("/login");
      }
    });
  }
  getbloglikelocaltrips(id, value) {
    this.zone.run(() => {
      for (let i = 0; i < this.blogtrips.length; i++) {
        if (this.blogtrips[i].id == id) {
          if (value == 1) {
            this.blogtrips[i].Like = true;
          } else {
            this.blogtrips[i].Like = false;
          }
          break;
        }
      }
    });
  }
  getbloglikelocal(id, value) {
    this.zone.run(() => {
      for (let i = 0; i < this.blog.length; i++) {
        if (this.blog[i].Id == id) {
          if (value == 1) {
            this.blog[i].Like = true;
          } else {
            this.blog[i].Like = false;
          }
          break;
        }
      }
    });
  }

  seemoredeal() {
    //this.presentLoadingNavigate();
    this.valueGlobal.backValue = "topdeallist";
    this.valueGlobal.logingoback = "topdeallist";
    setTimeout(()=>{
      this.navCtrl.navigateForward("/topdeallist");
    },250);
    this.hideStatusBar();
  }

  public scrollFunction = (event: any) => {
    var se = this;
      let el = document.getElementsByClassName('div-statusbar-float');
      if(el.length >0){
          if(event.detail.scrollTop > 100){
            el[0].classList.add('float-statusbar-enabled');
            el[0].classList.remove('float-statusbar-disabled');
          }else{
            el[0].classList.remove('float-statusbar-enabled');
            el[0].classList.add('float-statusbar-disabled');
          }
        }
  }
  doRefresh(event){
    this.loaddata();
    this.storage.remove("listblogtripdefault");
    this.storage.remove("listtopdealdefault");
    this.storage.remove("regionnamesuggest");
    this.onEnter();
    this.blogtrips = [];
    this.pageBlogTrip = 1;
    this.getbloglike(0);
    this.gf.setParams(false, "resetBlogTrips");
    setTimeout(()=>{
      event.target.complete();
     }, 1000)
  }

  openExperienceMusttry(idx){
    var se = this,
    regionCode = '';
    se.valueGlobal.backValue = 'experience';
    // se.gf.setParams(regionCode,'experiencesearch');
    // se.searchhotel.ef_arrdistancecheck = [];
    // se.searchhotel.ef_arrhoteltypecheck = [];
    // se.searchhotel.ef_arrstylecheck = [];
    // se.searchhotel.ef_arrlocalcheck = [];
    // se.searchhotel.ef_arrhouropencheck = [];
    // se.searchhotel.ef_arrsubregioncheck=[];
    // se.searchhotel.ef_arrsubregionnamecheck=[];
    // se.searchhotel.ef_arrhoteltypenamecheck = []
    // se.searchhotel.ef_arrdistancenamecheck = []
    // se.searchhotel.ef_arrhouropennamecheck=[];
    // se.searchhotel.ef_arrstylenamecheck=[];
    // se.searchhotel.ef_arrlocalnamecheck=[];
    // se.searchhotel.ef_location =null;
    // se.searchhotel.ef_hoteltype=null;
    // se.searchhotel.ef_houropen=null;
    // se.searchhotel.ef_style=null;
    // se.searchhotel.stringFilterName="";
    if(!se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, idx, 'filtername')){
      se.searchhotel.ef_arrhoteltypecheck.push(idx);
      se.searchhotel.stringFilterName = se.getFilterName(idx);
      se.searchhotel.ef_arrhoteltypenamecheck.push(se.getFilterName(idx));
    }
    // //se.searchhotel.experiencesearchTagsId = idx;
    
    // se.searchhotel.inputExperienceItem = null;
    // se.searchhotel.inputExperienceText = "";
    // se.searchhotel.inputExperienceRegionCode = "";
    if(!se.searchhotel.inputExperienceRegionCode && !se.searchhotel.inputExperienceItem){
      se.searchhotel.inputExperienceRegionName = "";
      se.searchhotel.inputExperienceText = "";
    }
    se.hideStatusBar();
    se.valueGlobal.logingoback = 'experiencesearch';
    se.navCtrl.navigateForward('/experiencesearch');
    se.gf.googleAnalytion("experiencesearch","Search","");
  }

  getTagByTypeName(){
    var se = this;
    if(se.searchhotel.ef_arrhoteltypenamecheck.length>0){
      se.searchhotel.ef_arrhoteltypenamecheck.forEach(element => {
        if(element == 'Ăn gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 3, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(3);
        }
        else if(element == 'Xem gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 6, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(6);
        }
        else if(element == 'Chơi gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 7, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(7);
        }
        else if(element == 'Ở đâu' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 4, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(4);
        }
        else if(element == 'Sống ảo' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 9, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(9);
        }
        else if(element == 'Uống gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 22, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(22);
        }
      });
    }
  }

  getFilterName(type){
    if(type==3){
      return "Ăn gì";
    }
    if(type==6){
      return "Xem gì";
    }
    if(type==7){
      return "Chơi gì";
    }
    if(type==4){
      return "Ở đâu";
    }
    if(type==9){
      return "Sống ảo";
    }
    if(type==22){
      return "Uống gì";
    }
  }
  getdatamytrip() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/dashboard/getmytrip?getall=true',
          headers:
          {
            'accept': 'application/json',
            'content-type': 'application/json-patch+json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (error) {
            error.page = "mytrips";
            error.func = "getdata";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            if (body) {
              se.zone.run(() => {
                let lstTrips = JSON.parse(body);
                se.storage.get('listmytrips').then(data => {
                  if(data){
                    se.storage.remove('listmytrips').then(()=>{
                      se.storage.set('listmytrips', lstTrips);
                    })
                  }else{
                    se.storage.set('listmytrips', lstTrips);
                  }
                })
                se.getCombineRequestTrip();
              });
            } 
          }
        });
      } 
    });
  }

  getCombineRequestTrip() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/dashboard/GetMyRequestPrice',
          headers:
          {
            'accept': 'application/json',
            'content-type': 'application/json-patch+json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "mytrips",
              func: "getRequestTrip",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options),
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "mytrips";
            error.func = "getRequestTrip";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            if (body) {
              se.zone.run(() => {             
                var result = JSON.parse(body);
                se.storage.get('listrequesttrips').then(data => {
                  if(data){
                    se.storage.remove('listrequesttrips').then(()=>{
                      se.storage.set('listrequesttrips', result);
                    })
                  }else{
                    se.storage.set('listrequesttrips', result);
                  }
                })
              });
            }
          }
        });
      }
    });
   
  }
  getCalendarholidays() {
    var se = this;
    var options = {
      method: 'GET',
      url: 'https://gate.ivivu.com/api/Data/calendarholidays',
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      se.valueGlobal.listlunar = [];
      var json = JSON.parse(body);
      se.valueGlobal.listlunar = json;
      se.cofdate = 0;
      se.cotdate = 0;
      se.bindlunar();
    })
  }
  checklunar(s) {
    return s.indexOf('Mùng') >= 0;
  }
  bindlunar() {
    var se = this;
    for (let i = 0; i < se.valueGlobal.listlunar.length; i++) {
      var checkdate = moment(se.valueGlobal.listlunar[i].date).format('YYYY-MM-DD');
      if (checkdate==se.cin) {
        se.cofdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay==1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.cinthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else
          {
            se.cinthu = se.valueGlobal.listlunar[i].name
          }
        }
      }
      else{
        this.getDayName(this.datecin, this.datecout);
      }
      if (checkdate==se.cout) {
        se.cotdate = 1;
        if (se.valueGlobal.listlunar[i].isNameDisplay==1) {
          var ischecklunar = se.checklunar(se.valueGlobal.listlunar[i].name);
          if (ischecklunar) {
            se.coutthu = se.valueGlobal.listlunar[i].name + ' ' + 'tết';
          }
          else
          {
            se.coutthu = se.valueGlobal.listlunar[i].name
          }
        }
      }
      else{
        this.getDayName(this.datecin, this.datecout);
      }
    }
  }
}


