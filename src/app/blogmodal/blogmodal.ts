import { Component, OnInit, NgZone,ViewChild, HostListener } from '@angular/core';
import { NavController, Platform, LoadingController,IonContent, ModalController, AlertController } from '@ionic/angular';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as request from 'requestretry';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ValueGlobal } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { SearchBlogModalPage } from '../searchblogmodal/searchblogmodal.page';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-blogmodal',
  templateUrl: 'blogmodal.html',
  styleUrls: ['blogmodal.scss'],
})
export class BlogModalPage implements OnInit{
  @ViewChild(IonContent) ioncontent: IonContent;
  blog;date;title;content;arrblog=[]
  blogID;urlblog;Liked=false;
  postLatest = [];
  myloader;items: any= [];
;
  searchblog =false;
  @ViewChild('inputSearchBlog') input;

  @HostListener( 'keydown', ['$event'] )
      keyEvent( e )
      {
          var code = e.keyCode || e.which;
          if( code === 13 )
          {
              if( e.srcElement.tagName === "INPUT" )
              {
                  e.preventDefault();
                  // let listitem = this.items.filter((item)=>{return item.show});
                  // if(listitem && listitem.length>0){
                  //   this.gf.setParams(this.items.filter((item)=>{return item.show}), 'listsearchblog');
                  //   this.keyboard.hide();
                  //   this.navCtrl.navigateForward('/searchblog');
                  // }
                  //this.onEnter();
                 //DeviceUtil.closeKeyboard();
              }
          }
      };
  constructor(public valueGlobal:ValueGlobal,public storage: Storage,public platform: Platform, 
    public navCtrl: NavController, public gf: GlobalFunction, private activatedRoute: ActivatedRoute, 
    public zone: NgZone,private socialSharing: SocialSharing, public value:ValueGlobal,private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,) {
    this.blogID = this.activatedRoute.snapshot.paramMap.get('id');
    if(!this.blogID){
      this.blogID = this.gf.getParams('blogid');
    }
    this.getdata(null,0);
    //Xử lý nút back của dt

    //google analytic
    gf.googleAnalytion('blog', 'load', '');
  }

  ngOnInit() {

  }
  clickSearchBlog(){
    this.searchblog = !this.searchblog;
  }
  clickCancel(){
    this.searchblog = !this.searchblog;
    this.input.value = '';
  }
  getdata(id,value) {
    var se = this;
    if (value==1) {
      se.blogID=id
    }
    se.presentLoadingData();
    var options = {
      method: 'GET',
      url: 'http://svc3.ivivu.com/GetBlogById',
      qs: { postid: id ? id : se.blogID },
      headers:
      {
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      se.zone.run(() => {
        se.blog = JSON.parse(body);
        se.title=se.blog.post.post_title;
        se.date= moment(se.blog.post.post_date).format('HH:ss DD/MM/YYYY');
        se.value.urlblog=se.blog.post.guid;
        // se.content ='';
        // se.content += "<label style='margin:0' style='color: #828282;font-size: 14px'>"+se.date+"</label>"
        if(se.myloader){
          se.myloader.dismiss();
        }
        se.content = se.blog.post.post_content;
        se.postLatest = se.blog.postLatest;
        for (let i = 0; i < se.postLatest.length; i++) {
          se.postLatest[i].Date = moment(se.postLatest[i].Date).format('HH:ss DD/MM/YYYY');
          se.postLatest[i].Like = false;
        }
        
        se.ioncontent.scrollToTop(100);
        se.getblog();

      })

      
    });
  }
  getblog()
  {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteBlogByUser',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (error) {
            error.page = "blog";
            error.func = "getblog";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
            throw new Error(error)
        }
        se.zone.run(() => {
          se.arrblog = JSON.parse(body);
          se.Liked=false;
          for (let i = 0; i < se.arrblog.length; i++) {
            if (se.arrblog[i].id==se.blogID) {
              se.Liked=true;
              
              break;
            }
            
          }
        });
        if(se.myloader){
          se.myloader.dismiss();
        }
        

      });
    }
    else
    {
      se.Liked=false;
    }
  });
}
  goback() {
    this.modalCtrl.dismiss();
    //this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
    // if(this.gf.getParams('blogid')){
    //   this.modalCtrl.dismiss();
    // }else{
    //   this.navCtrl.back();
    // }
  }
  share() {
    this.socialSharing.share(null, null, null, this.value.urlblog).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  shareitem(url) {
    this.socialSharing.share(null, null, null, url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  likeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.setItemLikeStatus();
        var text = "Bearer " + auth_token;
        var options = {
          method: 'POST',
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
          url: C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/AddFavouriteBlog',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            authorization: text
          },
          body: { postId: this.blogID },
          json: true
        };

        request(options, function (error, response, body) {
          if (error) {
            error.page="blog";
            error.func="likeItem";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          // se.zone.run(() => se.setItemLikeStatus());
        });
      }
      else {
        // se.valueGlobal.logingoback='TabPage';
        // se.navCtrl.navigateForward('/login');
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  unlikeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        this.setItemLikeStatus();
        var text = "Bearer " + auth_token;
        var options = {
          method: 'POST',
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/RemoveFavouriteHotelByUser',
          url: C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/RemoveFavouriteBlogByUser',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            authorization: text
          },
          body: { postId: this.blogID },
          json: true
        };

        request(options, function (error, response, body) {
          if (error) {
            error.page="blog";
            error.func="unlikeItem";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          // se.zone.run(() => se.setItemLikeStatus());
          
          //console.log(body);
        });
      }
      else {
        //this.navCtrl.navigateForward('/login');
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  setItemLikeStatus() {
    this.Liked = !this.Liked;
    
  }
  moreBlogLinkClick(id){
    
    this.getdata(id,1);
  }
  async presentLoadingData() {
    var se = this;
    se.myloader = await se.loadingCtrl.create({
      duration: 5000
    });
    se.myloader.present();
  }
  likeItemsame(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemLike(id);
        //se.zone.run(() => se.setItemLikeStatus());
        var text = "Bearer " + auth_token;
        var options = {
          method: 'POST',
          //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
          url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteBlog',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "blog",
              func: "likeItemsame",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "blog";
            error.func = "likeItemsame";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
        });
      }
      else {
        // se.valueGlobal.logingoback = 'TabPage';
        // se.navCtrl.navigateForward('/login');
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  unlikeItemsame(id) {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        se.bindItemUnLike(id);
        // se.zone.run(() => se.setItemLikeStatus());
        var text = "Bearer " + auth_token;
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteBlogByUser',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            authorization: text
          },
          body: { postId: id },
          json: true
        };

        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "blog",
              func: "unlikeItemsame",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "blog";
            error.func = "unlikeItemsame";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
        });
      }
      else {
        //this.navCtrl.navigateForward('/login');
        se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
      }
    });
  }
  bindItemLike(id) {
    var se = this;
    se.zone.run(() => {
      for (let i = 0; i < se.postLatest.length; i++) {
        if (se.postLatest[i].id == id) {
          se.postLatest[i].Like = true;
          break;
        }
      }
    })
  }
  bindItemUnLike(id) {
    var se = this;
    for (let i = 0; i < se.postLatest.length; i++) {
      if (se.postLatest[i].id == id) {
        se.zone.run(() => {
          se.postLatest[i].Like = false;
        })
        break;
      }
    }
  }

  cancelInput(){
    this.searchblog = false;
    this.input.value = '';
    this.items = [];
    //$('.div-cover').removeClass('glass-bloglist');
  }

  clickSearch(ev){
    var se = this;
    if(ev.detail.value){
      se.searchblog = true;
      const val = ev.detail.value;
      //Nếu mở từ susggest my trip thì ưu tiên sort theo vùng mytrip
      let url = C.urls.baseUrl.urlMobile + '/api/Data/SearchBlog?keyword='+val;
          se.gf.RequestApi('GET',url,{},{},'blog', 'clickSearch').then((data:any)=>{
            if(data && data.length>0){
              if(se.items.length ==0){
                data.forEach(element => {
                  element.show = true;
                })
                se.items.push(...data);
              }else{
                se.items.forEach(e => {
                  e.show = false;
                })

                data.forEach(element => {
                  let check = se.items.filter((i)=>{ return i.id == element.id });
                  if(check && check.length == 0)
                  {
                    element.show = true;
                    se.items.push(element);
                  }else{
                    check[0].show = true;
                  }
                })
                
              }
            }
          })
    }else{
      se.searchblog = false;
      se.items.forEach(element => {
          element.show = false;
      });
    }
  }

  itemSearchBlogClick(item, index){
    var se = this;
    if(item){
      
      if(item.type == 1){
        se.blogID = item.objectId;
        se.searchblog = false;
        se.input.value='';
        se.getdata(item.objectId, 1);
      }else{
        se.searchblog = false;
        se.input.value='';
        
        se.openSearchBlogModal(item);
        //se.navCtrl.navigateForward('/searchblog');
      }
    }
  }

  async openSearchBlogModal(item) {
    var se = this;
      if(item){
        se.gf.setParams(item.title, 'searchblogmodaltext');
        se.gf.setParams(item, 'itemslug');
          const modal: HTMLIonModalElement =
          await se.modalCtrl.create({
            component: SearchBlogModalPage
          });
          modal.present();

          modal.onDidDismiss().then((data) => {
            //se.gf.setParams(null,'blogid');
            // if(data.data == 'dismissall'){
            //   se.closeModal();
            // }
          })
      }
      // else{
      //   se.openWebpage(item.blogReference);
      // }
   // this.openWebpage(url);
  }

  public async showConfirmLogin(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: 'experience-search-confirm',
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
          alert.dismiss();
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
          this.zone.run(()=>{
          })
          this.modalCtrl.dismiss('dismissall');
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
    });
    alert.present();
    alert.onDidDismiss().then((data)=>{
    })
  }

}
