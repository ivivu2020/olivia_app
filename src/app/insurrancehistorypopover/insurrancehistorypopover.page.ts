import { InsurrancepopoverPage } from './../insurrancepopover/insurrancepopover.page';
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
import { Router } from '@angular/router';
import { ValueGlobal } from '../providers/book-service';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-insurrancehistorypopover',
  templateUrl: './insurrancehistorypopover.page.html',
  styleUrls: ['./insurrancehistorypopover.page.scss'],
})
export class InsurrancehistorypopoverPage implements OnInit {
  hasClaimDepart: any;
  hasClaimReturn: any;
  departFlightNumber: any="";
  returnFlightNumber: any="";
  departCodeDisplay: string;
  arrivalCodeDisplay: string;

  constructor(public popoverController: PopoverController,
    public gf: GlobalFunction,
    public valueGlobal: ValueGlobal,
    public router: Router,
    private callNumber: CallNumber) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    var se = this;
    
    //se.gf.setParams({ childlist: se.arrchild, trip: trip }, 'insurrenceHistory' );
    var obj = se.gf.getParams('insurrenceHistory');
    if(obj){
      se.departFlightNumber = obj.departFlightNumber;
      se.returnFlightNumber = obj.returnFlightNumber;
      se.hasClaimDepart = obj.claimedDepart;
      se.hasClaimReturn = obj.claimedReturn;

      if(obj.trip.bookingsComboData && obj.trip.bookingsComboData.length >1){
        se.departCodeDisplay =  obj.trip.bookingsComboData[0].departCode + ' → ' + obj.trip.bookingsComboData[0].arrivalCode;
        se.arrivalCodeDisplay = obj.trip.bookingsComboData[1].departCode + ' → ' + obj.trip.bookingsComboData[1].arrivalCode;
      }
    }
  }

  async presentPopover(ev: any, value) {
    var se = this;
    var obj = se.gf.getParams('insurrenceDetail');
    if(obj){
      obj.type = value;
      obj.flightNumber = (value == 1 || value==3) ? obj.departFlightNumber : obj.returnFlightNumber;
      //se.hasClaimDepart = obj.claimedDepart;
      //se.hasClaimReturn = obj.claimedReturn;
      se.popoverController.dismiss();
      se.valueGlobal.popover.dismiss();
      se.router.navigateByUrl("/insurrancedetail");
    }
    // se.gf.setParams(obj, 'insurrenceDetail');
    // const popover = await this.popoverController.create({
    //   component: InsurrancepopoverPage,
    //   event: ev,
    //   translucent: true,
    //   cssClass: 'popover-content-history'
    // });

    // return await popover.present();
  }

  /***
     * Gọi tổng đài hỗ trợ
     * PDANH 26/02/2019
     */
    async makeCallSupport(phone){
      try {
        setTimeout(() => {
          this.callNumber.callNumber(phone,true);
        },10);
      }
      catch (error) {
      }
    }
}
