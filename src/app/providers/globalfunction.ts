import { Injectable, EventEmitter } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Platform, AlertController, ToastController, NavController } from '@ionic/angular';
import { C } from '../providers/constants';
import * as $ from 'jquery';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from './book-service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { File as IonicFileService, FileEntry, IFile } from '@ionic-native/file/ngx';
import { NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class GlobalFunction{
  private listCarParams : any;
  private listObjcars : any;
    private DepartureParams :any;
    private showpickupdatefromdetail = false;
    private HotelRoomDetail: any;
    private exchangeGiftParams: any;
    private mytripBookingDetailParams: any;
    private roomInfoParams: any;
    private hotelNotesParams: any;
    private hotelExpsNotesParams: any;
    private showOccupancyFromRequestcombo: boolean = false;
    private hotelListMoodParams:any;
    private listFlightParams:any;
    private flightComboParams:any;
    private hotellistmoodselectedParams:any;
    private seemoreblogParams: any;
    private resetBlogTripsParams: any;
  notifiBookingCodeParams: any;
  userAvatarParams: any;
  tripFeedBackParams: any;
  selectedTab3Params: any;
  notifiSwitchObjParams: any;
  experiencesearchParams: any;
  experienceItemParams: any;
  experienceFilter_regionIdParams: any;
  experiencesearchTagsIdParams: any;
  listDistanceNearByParams: any;
  listSearch_ExperienceDetailParams: any;
  experienceFilter_regionCodeParams: any;
  listsearchblogParams: any;
  blogidParams: any;
  itemslugParams: any;
  searchblogtextParams: any;
  experienceLocationParams: any;
  insurrenceDetailParams: any;
  insurranceClaimedParams: any;
  insurrenceHistoryParams: any;

    constructor(public platform: Platform,public fba: FirebaseAnalytics, public alertCtrl: AlertController,public toastCtrl: ToastController,
      public storage: Storage,
      public navCtrl: NavController,
      public valueGlobal: ValueGlobal,
      public appVersion: AppVersion,
      private ionicFileService: IonicFileService){

    }
    
    public googleAnalytion(viewName,action,options ){
        if(C.ENV == "prod"){
            this.platform.ready().then(() => {
              if(action != "screen_view"){
                this.fba.logEvent(action, { 'hitType': 'event', 'eventCategory': viewName , 'eventLabel': options})
                .then((res: any) => {console.log(res);})
                .catch((error: any) => console.error(error));
              }else{
                //this.fba.logEvent(action, { 'hitType': 'event', 'firebase_screen_class': viewName , 'firebase_screen_name': viewName})
                //.then((res: any) => {console.log(res);})
                //.catch((error: any) => console.error(error));
                this.fba.setCurrentScreen(viewName);
              }
              
        })
      }
    }
    
    public googleAnalytionCustom(action,params ){
      if(C.ENV == "prod"){
          this.platform.ready().then(() => {
            this.fba.logEvent(action, params)
            .then((res: any) => {console.log(res);})
            .catch((error: any) => console.error(error));
      })
    }
  }

    /**
     * Hàm show cảnh báo chung
     * @param header header của warning
     * @param msg nội dung warning
     * @param textButtonOK text hiển thị button ok
     */
    public async showWarning(header,msg,textButtonOK){
      //if(!this.alertCtrl){
        let alert = await this.toastCtrl.create({
        //   header: header,
        //   message: msg,
        //   buttons: [{
        //     text: textButtonOK,
        //     role: 'OK',
        //     handler: () => {
        //     }
        //   }
        // ]
        message: msg,
        position: "top",
        header: header,
        duration: 3000
      });
      alert.present();
      //}
    }

    public setParams(params,type) {
      if(type == 'departure'){
        this.DepartureParams = params;
      }
      if(type == 'showpickupdatefromdetail'){
        this.showpickupdatefromdetail = params;
      }
      if(type=='hotelroomdetail'){
        this.HotelRoomDetail = params;
      }
      if(type=='exchangegift'){
        this.exchangeGiftParams = params;
      }
      if(type=='mytripbookingdetail'){
        this.mytripBookingDetailParams = params;
      }
      if(type=='roomInfo'){
        this.roomInfoParams = params;
      }
      if(type=='hotelnotes'){
        this.hotelNotesParams = params;
      }
      if(type=='hotelexpsnotes'){
        this.hotelExpsNotesParams = params;
      }
      if(type=='requestcombo'){
        this.showOccupancyFromRequestcombo = params;
      }
      if(type=='hotellistmood'){
        this.hotelListMoodParams = params;
      }
      if(type=='hotellistmoodselected'){
        this.hotellistmoodselectedParams = params;
      }
      if(type=='listflight'){
        this.listFlightParams = params;
      }
      if(type=='flightcombo'){
        this.flightComboParams = params;
      }
      if(type=='seemoreblog'){
        this.seemoreblogParams = params;
      }
      if(type=='resetBlogTrips'){
        this.resetBlogTripsParams = params;
      }
      if(type=='notifiBookingCode'){
        this.notifiBookingCodeParams = params;
      }
      if(type =='userAvatar'){
        this.userAvatarParams = params;
      }
      if(type == 'tripFeedBack'){
        this.tripFeedBackParams = params;
      }
      if(type == 'selectedTab3'){
        this.selectedTab3Params = params;
      }
      if(type =='notifiSwitchObj'){
        this.notifiSwitchObjParams = params;
      }
      if(type=='experiencesearch'){
        this.experiencesearchParams = params;
    }
    if(type=='experienceItem'){
        this.experienceItemParams = params;
    }
    if(type=='experienceFilter_regionId'){
        this.experienceFilter_regionIdParams = params;
    }
    if(type=='experienceFilter_regionCode'){
      this.experienceFilter_regionCodeParams = params;
    }
    if(type=='experiencesearchTagsId'){
        this.experiencesearchTagsIdParams = params;
    }
    if(type=='listDistanceNearBy'){
        this.listDistanceNearByParams = params;
    }
    if(type=='listSearch_ExperienceDetail'){
        this.listSearch_ExperienceDetailParams = params;
    }
    if(type=='listsearchblog'){
      this.listsearchblogParams = params;
    }
    if(type=='blogid'){
      this.blogidParams = params;
    }
    if(type=='itemslug'){
      this.itemslugParams = params;
    }
    if(type=='searchblogtext'){
      this.searchblogtextParams = params;
    }
    if(type=='searchblogmodaltext'){
      this.searchblogtextParams = params;
    }
    if(type == 'experienceLocation'){
      this.experienceLocationParams = params;
    }
    if (type == 'listcar') {
      this.listCarParams = params;
  }
  if (type == 'carscombo') {
      this.listObjcars = params;
  }
   
        if(type=='insurrenceDetail'){
            this.insurrenceDetailParams = params;
        }
        if(type=='insurranceClaimed'){
            this.insurranceClaimedParams = params;
        }
        if(type=='insurrenceHistory'){
            this.insurrenceHistoryParams = params;
        }
    }
  
    public getParams(type) {
      if(type == 'departure'){
        return this.DepartureParams;
      }
      if(type == 'showpickupdatefromdetail'){
        return this.showpickupdatefromdetail;
      }
      if(type=='hotelroomdetail'){
        return this.HotelRoomDetail;
      }
      if(type=='exchangegift'){
        return this.exchangeGiftParams;
      }
      if(type=='mytripbookingdetail'){
        return this.mytripBookingDetailParams;
      }
      if(type=='roomInfo'){
        return this.roomInfoParams;
      }
      if(type=='hotelnotes'){
        return this.hotelNotesParams;
      }
      if(type=='hotelexpsnotes'){
        return this.hotelExpsNotesParams;
      }
      if(type=='requestcombo'){
        return this.showOccupancyFromRequestcombo;
      }
      if(type=='hotellistmood'){
        return this.hotelListMoodParams;
      }
      if(type=='hotellistmoodselected'){
        return this.hotellistmoodselectedParams;
      }
      if(type=='listflight'){
        return this.listFlightParams;
      }
      if(type=='flightcombo'){
        return this.flightComboParams;
      }
      if(type=='seemoreblog'){
        return this.seemoreblogParams;
      }
      if(type=='resetBlogTrips'){
        return this.resetBlogTripsParams;
      }
      if(type=='notifiBookingCode'){
        return this.notifiBookingCodeParams;
      }
      if(type =='userAvatar'){
        return this.userAvatarParams;
      }
      if(type == 'tripFeedBack'){
        return this.tripFeedBackParams;
      }
      if(type == 'selectedTab3'){
        return this.selectedTab3Params;
      }
      if(type =='notifiSwitchObj'){
        return this.notifiSwitchObjParams;
      }
      if(type=='experiencesearch'){
        return this.experiencesearchParams;
      }
      if(type=='experienceItem'){
        return this.experienceItemParams;
      }
      if(type=='experienceFilter_regionId'){
        return this.experienceFilter_regionIdParams;
      }
      if(type=='experienceFilter_regionCode'){
        return this.experienceFilter_regionCodeParams;
      }
      if(type=='experiencesearchTagsId'){
        return this.experiencesearchTagsIdParams;
      }
      if(type=='listDistanceNearBy'){
        return this.listDistanceNearByParams;
      }
      if(type=='listSearch_ExperienceDetail'){
        return this.listSearch_ExperienceDetailParams;
      }
      if(type=='listsearchblog'){
        return this.listsearchblogParams;
      }
      if(type=='blogid'){
        return this.blogidParams;
      }
      if(type=='itemslug'){
        return this.itemslugParams;
      }
      if(type=='searchblogtext'){
        return this.searchblogtextParams;
      }
      if(type=='searchblogmodaltext'){
        return this.searchblogtextParams;
      }
      if(type == 'experienceLocation'){
        return this.experienceLocationParams;
      }
      if (type == 'listcar') {
      return this.listCarParams;
      }
      if (type == 'carscombo') {
          return this.listObjcars;
      }
      if(type=='insurrenceDetail'){
        return this.insurrenceDetailParams;
      }
      if(type=='insurranceClaimed'){
        return this.insurranceClaimedParams;
      }
      if(type=='insurrenceHistory'){
        return this.insurrenceHistoryParams;
      }
    }

    public checkExistsIndex(array,idx){
      return array.find((item) => {
         return item == idx;
      })
    }

    checkExistsItemInArray(arrays: any, item: any, type: any) {
      var res = false;
      if (type == 'trip') {
        res = arrays.some(r => r.id == item.id);
      }
      if(type == 'experiencesearch' || 'blog'){
        res = arrays.some(r => r.id == item.id);
      }
      if(type=='filtername'){
        res = arrays.some(r => r == item);
      }
      return res;
    }
  
    public removeItem(array,itemcheck){
      array.forEach( (item, index) => {
        if(item == itemcheck) array.splice(index,1);
      });
   }

   public removeItemInArray(array,item){
    array.forEach( (arrayItem, index) => {
      if(arrayItem.id == item.id) array.splice(index,1);
    });
 }

   public async showToastWarning(msg){
    let alert = await this.toastCtrl.create(({
      message: msg,
      duration: 3000,
      position: "top"
    }))
    alert.present();
  }

  public setActivatedTab(tabIndex){
    var objTab = document.querySelectorAll('ion-tab-bar');
    if(objTab && objTab.length >0){
      var tab = objTab[objTab.length-1];
      if(tab){
        setTimeout(() => {
          //$(tab.children.item( (tabIndex-1)*2 )).addClass('tab-selected');
          //$(tab.children.item( (tabIndex-1)*2 )).attr('aria-selected','true');
          $(tab.children.item( (tabIndex-1)*2 )).attr('aria-selected','true').siblings().attr('aria-selected','false');
        }, 500);
          
      }
    }
   }

   /**
    * Đẩy token + memberid lưu xuống db
    * @param devicetoken key token của device
    * @param authentoken key id member user
    */
   pushTokenAndMemberID(authentoken, devicetoken, appversion){
    var se = this;
    console.log(devicetoken);
    if (authentoken) {
        var text = "Bearer " + authentoken;
        var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/PushTokenOfUser',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/json-patch+json',
            authorization: text
        },
        body: { tokenId: devicetoken, appVersion: appversion.replace(/\./g, '') },
        json: true
      };
      request(options, function (error, response, body) {
          if (error) {
              error.page = "login";
              error.func = "pushTokenAndMemberID";
              error.param = JSON.stringify(options);
              C.writeErrorLog(error,response);
          }else if(body){
              var obj = JSON.parse(body);
             
          }
      })
    }
  }

  DeleteTokenOfUser(deviceToken, userToken, appversion) {
    var se = this;
    if (userToken) {
        var text = "Bearer " + userToken;
        var options = {
            method: 'POST',
            url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/DeleteNotificationTokenOfUser',
            timeout: 10000,
            maxAttempts: 5,
            retryDelay: 2000,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json-patch+json',
                authorization: text
            },
            body: {
                tokenId: deviceToken,
                appVersion: appversion ? appversion.replace(/\./g, '') : ''
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) {
                error.page = "logout";
                error.func = "DeleteNotificationTokenOfUser";
                error.param = JSON.stringify(options);
                C.writeErrorLog(error,response);
            }
        })
    }
}

public getAppVersion() {
  this.appVersion.getVersionNumber().then(version => {
      return version.replace(/\./g, '');
  })
}

  /**
  * Hàm gọi api chung
  * @param methodFunc phương thức GET/POST
  * @param strUrl Chuỗi api
  * @param headerObj object header nếu có
  * @param bodyObj object body nếu có
  * @param pageName Tên page gọi api
  * @param funcName Tên fucntion gọi api
  */
  async RequestApi(methodFunc, strUrl, headerObj, bodyObj, pageName, funcName): Promise<any> {
    var se = this; 
    return new Promise(
        (resolve, reject) => {
          var options;
          if(headerObj && bodyObj ){
            options = {
              method: methodFunc,
              url: strUrl,
              headers: headerObj,
              body: bodyObj,
              json: true,
              timeout: 180000,
              maxAttempts: 5,
              retryDelay: 2000
            }
          }
          
          if(headerObj && !bodyObj){
            options = {
              method: methodFunc,
              url: strUrl,
              timeout: 180000,
              maxAttempts: 5,
              retryDelay: 2000,
              headers: headerObj
            }
          }

          if(!headerObj && !bodyObj){
            options = {
              method: methodFunc,
              url: strUrl,
              timeout: 180000,
              maxAttempts: 5,
              retryDelay: 2000,
            }
          }

            request(options, function (error, response, body) {
                if (response.statusCode != 200) {
                  if(headerObj && headerObj.authorization && response.statusCode == 401){//Token hết hạn
                    //se.showConfirm("Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.");
                  }else{
                      var objError = {
                          page: pageName,
                          func: funcName,
                          message: response.statusMessage,
                          content: response.body,
                          type: "warning",
                          param: JSON.stringify(options)
                      };
                      C.writeErrorLog(objError,response);
                  }
                }
                if (error) {
                    error.page = pageName;
                    error.func = funcName;
                    error.param = JSON.stringify(options);
                    C.writeErrorLog(objError,response);
                }
                if (response && response.statusCode == 200) {
                  if(body && body.data){
                    resolve(body);
                  } 
                  else if(body && body.tags || body.length >=0 || body.listRegion || body.childRegions || body.subRegions || body.post){
                      resolve(body);
                  }
                  else if(body && body.msg){
                    resolve(body.msg);
                  }
                  else if(body && body.success){
                    resolve(body.success);
                  }
                  else{
                      resolve(JSON.parse(body));
                  }
                }else{
                  resolve([]);
                }

            })
        }
    )
  }

  public async showConfirm(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'cls-global-confirm',
      buttons: [
      {
        text: 'Để sau',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('blogtripdefault');
          this.storage.remove('infocus');
          this.navCtrl.navigateBack('/');
        }
      },
      {
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('blogtripdefault');
          //this.valueGlobal.logingoback = "MainPage";
          this.navCtrl.navigateForward('/login');
        }
        }
      ]
    });
    alert.present();
  }

  public clearActivatedTab() {
    var objTab = document.querySelectorAll('ion-tab-bar');
    if (objTab && objTab.length > 0) {
        objTab.forEach(element => {
            if (element) {
                //clear current activcetab
                for(let i= 1; i <=5; i++){
                    $(element.children.item((i - 1) * 2)).attr('aria-selected', 'false');
                }
            }
        });
    }
}

  // public hiddenHeader(){
  //   let headerelement = document.getElementsByTagName('ion-header');
  //   if(headerelement && headerelement.length >0){
  //     setTimeout(()=>{
  //       headerelement[0].classList.add('float-statusbar-disabled');
  //     },150)
  //   }
  // }
  public showHeader(){
    let headerelement = document.getElementsByTagName('ion-header');
    if(headerelement && headerelement.length >0){
      setTimeout(()=>{
        headerelement[0].classList.remove('float-statusbar-disabled');
      },150)
    }
  }

  async getMultipleFiles(filePaths: string[]): Promise<File[]> {
    // Get FileEntry array from the array of image paths
    const fileEntryPromises: Promise<FileEntry>[] = filePaths.map(filePath => {
      return this.ionicFileService.resolveLocalFilesystemUrl(filePath);
    }) as Promise<FileEntry>[];

    const fileEntries: FileEntry[] = await Promise.all(fileEntryPromises);

    // Get a File array from the FileEntry array. NOTE that while this looks like a regular File, it does
    // not have any actual data in it. Only after we use a FileReader will the File object contain the actual
    // file data
    const CordovaFilePromises: Promise<IFile>[] = fileEntries.map(fileEntry => {
      return this.convertFileEntryToCordovaFile(fileEntry);
    });

    const cordovaFiles: IFile[] = await Promise.all(CordovaFilePromises);

    // Use FileReader on each File object to read the actual file data into the file object
    const filePromises: Promise<File>[] = cordovaFiles.map(cordovaFile => {
      return this.convertCordovaFileToJavascriptFile(cordovaFile)
    });

    // When this resolves, it will return a list of File objects, just as if you had used the regular web
    // file input. These can then be appended to FormData and uploaded.
    return await Promise.all(filePromises);
  }

  async getSingleFile(filePath: string): Promise<File> {
    // Get FileEntry from image path
    const fileEntry: FileEntry = await this.ionicFileService.resolveLocalFilesystemUrl(filePath) as FileEntry;

    // Get File from FileEntry. Again note that this file does not contain the actual file data yet.
    const cordovaFile: IFile = await this.convertFileEntryToCordovaFile(fileEntry);

    // Use FileReader on each object to populate it with the true file contents.
    return this.convertCordovaFileToJavascriptFile(cordovaFile);
  }

  private convertFileEntryToCordovaFile(fileEntry: FileEntry): Promise<IFile> {
    return new Promise<IFile>((resolve, reject) => {
      fileEntry.file(resolve, reject);
    })
  }

  private convertCordovaFileToJavascriptFile(cordovaFile: IFile): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.error) {
          reject(reader.error);
        } else {
          const blob: any = new Blob([reader.result], { type: cordovaFile.type });
          blob.lastModifiedDate = new Date();
          blob.name = cordovaFile.name;
          resolve(blob as File);
        }
      };
      reader.readAsArrayBuffer(cordovaFile);
    });

  }

  
    /**
   * Chuyển ký tự font VNi vd: â - a ...
   */
  convertFontVNI(obj){
    if(obj.indexOf('đ') != -1 || obj.indexOf('Đ') != -1){
      obj = obj.replace('đ','d').replace('Đ','D');
    }
    if(obj.indexOf('ă') != -1 || obj.indexOf('Ă') != -1){
      obj = obj.replace('ă','a').replace('Ă','A');
    }
    if(obj.indexOf('â') != -1 || obj.indexOf('Â') != -1){
      obj = obj.replace('â','a').replace('Â','Â');
    }
    if(obj.indexOf('á') != -1 || obj.indexOf('Á') != -1){
      obj = obj.replace('á','a').replace('Á','A');
    }
    if(obj.indexOf('à') != -1 || obj.indexOf('À') != -1){
      obj = obj.replace('à','a').replace('À','A');
    }
    if(obj.indexOf('ấ') != -1 || obj.indexOf('Ấ') != -1){
      obj = obj.replace('ấ','a').replace('Ấ','A');
    }
    if(obj.indexOf('ầ') != -1 || obj.indexOf('Ầ') != -1){
      obj = obj.replace('ầ','a').replace('Ầ','A');
    }
    if(obj.indexOf('ẵ') != -1 || obj.indexOf('Ẵ') != -1){
      obj = obj.replace('ẵ','a').replace('Ẵ','A');
    }
    if(obj.indexOf('ặ') != -1 || obj.indexOf('Ặ') != -1){
      obj = obj.replace('ặ','a').replace('Ặ','A');
    }
    if(obj.indexOf('ậ') != -1 || obj.indexOf('Ậ') != -1){
      obj = obj.replace('ậ','a').replace('Ậ','A');
    }
    if(obj.indexOf('ạ') != -1 || obj.indexOf('Ạ') != -1){
      obj = obj.replace('ạ','a').replace('Ạ','A');
    }
    if(obj.indexOf('à') != -1 || obj.indexOf('À') != -1){
        obj = obj.replace('à','a').replace('À','A');
      }
    
    if(obj.indexOf('ê') != -1 || obj.indexOf('Ê') != -1){
      obj = obj.replace('ê','e').replace('Ê','Ê');
    }
    if(obj.indexOf('é') != -1 || obj.indexOf('É') != -1){
      obj = obj.replace('é','e').replace('É','E');
    }
    if(obj.indexOf('è') != -1 || obj.indexOf('È') != -1){
      obj = obj.replace('è','e').replace('È','E');
    }
    if(obj.indexOf('ẻ') != -1 || obj.indexOf('Ẻ') != -1){
      obj = obj.replace('ẻ','e').replace('Ẻ','E');
    }
    if(obj.indexOf('ẽ') != -1 || obj.indexOf('Ẽ') != -1){
      obj = obj.replace('ẽ','e').replace('Ẽ','E');
    }
    if(obj.indexOf('ệ') != -1 || obj.indexOf('Ệ') != -1){
      obj = obj.replace('ệ','e').replace('Ệ','E');
    }
    if(obj.indexOf('ễ') != -1 || obj.indexOf('Ễ') != -1){
      obj = obj.replace('ễ','e').replace('Ễ','E');
    }
    if(obj.indexOf('ẹ') != -1 || obj.indexOf('Ẹ') != -1){
      obj = obj.replace('ẹ','e').replace('Ẹ','E');
    }

    if(obj.indexOf('ô') != -1 || obj.indexOf('Ô') != -1){
      obj = obj.replace('ô','o').replace('Ô','O');
    }
    if(obj.indexOf('ồ') != -1 || obj.indexOf('Ồ') != -1){
      obj = obj.replace('ồ','o').replace('Ồ','O');
    }
    if(obj.indexOf('ố') != -1 || obj.indexOf('Ố') != -1){
      obj = obj.replace('ố','o').replace('Ố','O');
    }
    if(obj.indexOf('ổ') != -1 || obj.indexOf('Ổ') != -1){
      obj = obj.replace('ổ','o').replace('Ổ','O');
    }
    if(obj.indexOf('ộ') != -1 || obj.indexOf('Ộ') != -1){
      obj = obj.replace('ộ','o').replace('Ộ','O');
    }
    if(obj.indexOf('ỗ') != -1 || obj.indexOf('Ỗ') != -1){
      obj = obj.replace('ỗ','o').replace('Ỗ','O');
    }
    if(obj.indexOf('ọ') != -1 || obj.indexOf('Ọ') != -1){
      obj = obj.replace('ọ','o').replace('Ọ','O');
    }
    if(obj.indexOf('ò') != -1 || obj.indexOf('Ò') != -1){
      obj = obj.replace('ò','o').replace('Ò','O');
    }
    if(obj.indexOf('ơ') != -1 || obj.indexOf('Ơ') != -1){
      obj = obj.replace('ơ','o').replace('Ơ','O');
    }
    if(obj.indexOf('ờ') != -1 || obj.indexOf('Ờ') != -1){
      obj = obj.replace('ờ','o').replace('Ờ','O');
    }
    if(obj.indexOf('ớ') != -1 || obj.indexOf('Ớ') != -1){
      obj = obj.replace('ớ','o').replace('Ớ','O');
    }
    if(obj.indexOf('ở') != -1 || obj.indexOf('Ở') != -1){
      obj = obj.replace('ở','o').replace('Ở','O');
    }
    if(obj.indexOf('ợ') != -1 || obj.indexOf('Ợ') != -1){
      obj = obj.replace('ợ','o').replace('Ợ','O');
    }
    if(obj.indexOf('ỡ') != -1 || obj.indexOf('Ỡ') != -1){
      obj = obj.replace('ỡ','o').replace('Ỡ','O');
    }

    if(obj.indexOf('ú') != -1 || obj.indexOf('Ú') != -1){
      obj = obj.replace('ú','u').replace('Ú','U');
    }
    if(obj.indexOf('ù') != -1 || obj.indexOf('Ù') != -1){
      obj = obj.replace('ù','u').replace('Ù','U');
    }
    if(obj.indexOf('ủ') != -1 || obj.indexOf('Ủ') != -1){
      obj = obj.replace('ủ','u').replace('Ủ','U');
    }
    if(obj.indexOf('ũ') != -1 || obj.indexOf('Ũ') != -1){
      obj = obj.replace('ũ','u').replace('Ũ','U');
    }
    if(obj.indexOf('ụ') != -1 || obj.indexOf('Ụ') != -1){
      obj = obj.replace('ụ','u').replace('Ụ','U');
    }
    if(obj.indexOf('ư') != -1 || obj.indexOf('Ư') != -1){
      obj = obj.replace('ư','u').replace('Ư','U');
    }
    if(obj.indexOf('ừ') != -1 || obj.indexOf('Ừ') != -1){
      obj = obj.replace('ừ','u').replace('Ừ','U');
    }
    if(obj.indexOf('ứ') != -1 || obj.indexOf('Ứ') != -1){
      obj = obj.replace('ứ','u').replace('Ứ','U');
    }
    if(obj.indexOf('ử') != -1 || obj.indexOf('Ử') != -1){
      obj = obj.replace('ử','u').replace('Ử','U');
    }
    if(obj.indexOf('ự') != -1 || obj.indexOf('Ự') != -1){
      obj = obj.replace('ự','u').replace('Ự','U');
    }
    if(obj.indexOf('ữ') != -1 || obj.indexOf('Ữ') != -1){
      obj = obj.replace('ữ','u').replace('Ữ','U');
    }

    if(obj.indexOf('í') != -1 || obj.indexOf('Í') != -1){
      obj = obj.replace('í','i').replace('Í','I');
    }
    if(obj.indexOf('ì') != -1 || obj.indexOf('Ì') != -1){
      obj = obj.replace('ì','i').replace('Ì','I');
    }
    if(obj.indexOf('ỉ') != -1 || obj.indexOf('Ỉ') != -1){
      obj = obj.replace('ỉ','i').replace('Ỉ','I');
    }
    if(obj.indexOf('ĩ') != -1 || obj.indexOf('Ĩ') != -1){
      obj = obj.replace('ĩ','i').replace('Ĩ','I');
    }
    if(obj.indexOf('ị') != -1 || obj.indexOf('Ị') != -1){
      obj = obj.replace('ị','i').replace('Ị','I');
    }
    

    return obj;
  }

  /**
   * Hàm set hiệu ứng chuyển page
   * @param nativePageTransitions provider injection
   * @param direction hướng chuyển page vd: 'left', 'right'
   */
  public setNativeSlide(nativePageTransitions, direction){
    let options: NativeTransitionOptions = {
      direction: direction,
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 0
     }
  
    nativePageTransitions.fade(options);
  }
}


export class ActivityService {
  currentArticle = new EventEmitter();
  
  public bank: any;
  public child: any;
  public insurranceBookingId:any;
  objClaimed: any;
  tab3Loaded: any;
  listExperienceSearch: any[];
  listTopDeal:any = [];
  HotelSearchReqContract: any;
  firstloadhotelist: any;
  //abortSearch: boolean;
}