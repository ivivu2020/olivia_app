import { Component,OnInit,NgZone } from '@angular/core';
import { Platform,NavController,ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import * as request from 'requestretry';
import { ActivatedRoute } from '@angular/router';
import { HotelreviewsimagePage } from './../hotelreviewsimage/hotelreviewsimage';
import { SearchHotel } from '../providers/book-service';
/**
 * Generated class for the HotelreviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-hotelreviews',
  templateUrl: 'hotelreviews.html',
  styleUrls: ['hotelreviews.scss'],
})
export class HotelReviewsPage implements OnInit{

  Name;
  HotelReviews;
  HotelID;
  arrHotelReviews=[];
  constructor(public platform: Platform,public navCtrl: NavController,public gf: GlobalFunction,private activatedRoute: ActivatedRoute,public zone: NgZone, public searchhotel: SearchHotel, public modalCtrl: ModalController) {
    this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
    this.Name = this.activatedRoute.snapshot.paramMap.get('name');
    this.getdata() ;
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
      })
    })
    //google analytic
    gf.googleAnalytion('hotelreviews','load','');
  }

  ngOnInit(){

  }

  goback(){
    this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.HotelID]);
  }
  getdata() {
    var se=this;
    let url = C.urls.baseUrl.urlPost +"/mhoteldetail/"+this.HotelID;
    var options = {
      method: 'POST',
      url: url,
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      if(response.statusCode != 200){
        var objError ={
            page: "hotelreviews",
            func: "getdata",
            message : response.statusMessage,
            content : response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page="hotelreviews";
        error.func="loaddata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError,response);
      }
      if(response.statusCode== 200){
        let jsondata = JSON.parse(body);
        
        se.zone.run(()=>{
          se.Name=jsondata.Name;
          se.HotelReviews=jsondata.HotelReviews
  
            for (let index = 0; index <  se.HotelReviews.length; index++) {
  
              se.HotelReviews[index].DateStayed = moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY');
              // se.HotelReviews[index].ReviewPoint = Math.round(se.HotelReviews[index].ReviewPoint *100)/100;
              se.HotelReviews[index].ReviewPoint= Math.round(se.HotelReviews[index].ReviewPoint *100)/100
              se.arrHotelReviews.push(se.HotelReviews[index]);
            }
            se.sortdate();
        })
       
      }
    })
  }

  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
    sortdate() {
      var se = this;
      if (se.arrHotelReviews && se.arrHotelReviews.length > 0) {
        se.zone.run(() => se.arrHotelReviews.sort(function (a, b) {
          let direction = 1;
            if (moment(a['DateSort']).diff(moment(b['DateSort']), 'days') >0) {
              return -1 * direction;
            }
            else {
              return 1 * direction;
            }
        }));
      }
    };
    async imgreview(arrimgreview, indeximgreview,CustomerName,DateStayed) {
      this.searchhotel.arrimgreview = arrimgreview;
      this.searchhotel.indexreviewimg = indeximgreview;
      this.searchhotel.cusnamereview = CustomerName;
      this.searchhotel.datereview = DateStayed;
      const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: HotelreviewsimagePage,
        });
      modal.present();
    }

}
