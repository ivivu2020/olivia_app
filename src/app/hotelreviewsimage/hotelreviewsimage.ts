import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, IonSlides } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';


/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-hotelreviewsimage',
  templateUrl: 'hotelreviewsimage.html',
  styleUrls: ['hotelreviewsimage.scss'],
})
export class HotelreviewsimagePage  {
  arrimgreview=[];cusnamereview;datereview;countslide=1;lengthslide;ischeckslide=false
  @ViewChild('mySlider') slider: IonSlides;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public searchhotel: SearchHotel,public zone:NgZone) {
  }
  goback() {
    this.modalCtrl.dismiss();
  }
  ionViewDidEnter() {
    this.cusnamereview=this.searchhotel.cusnamereview;
    this.datereview=this.searchhotel.datereview;
    setTimeout(() => {
      this.arrimgreview = this.searchhotel.arrimgreview;
      this.slider.slideTo(this.searchhotel.indexreviewimg);
      this.lengthslide=this.arrimgreview.length;
      this.ischeckslide=true;
    },900)
    console.log(this.lengthslide=this.arrimgreview.length);

  }
  nextslide()
  {
    if (this.countslide<this.arrimgreview.length) {
      this.countslide= this.countslide+1;
      this.slider.slideTo(this.countslide-1);
    }

  }
  backslide()
  {
    if (this.countslide-1>0) {
      this.countslide= this.countslide-1;
      this.slider.slideTo(this.countslide-1);
    }

  }
  ionSlideDidChange()
  {
    this.slider.getActiveIndex().then(index => {
      this.countslide = index + 1;
    });
  }
}