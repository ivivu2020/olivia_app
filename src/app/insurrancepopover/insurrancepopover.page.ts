import { ValueGlobal } from './../providers/book-service';
import { InsurrancehistorypopoverPage } from './../insurrancehistorypopover/insurrancehistorypopover.page';
import { NavController, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from '../providers/globalfunction';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-insurrancepopover',
  templateUrl: './insurrancepopover.page.html',
  styleUrls: ['./insurrancepopover.page.scss'],
})
export class InsurrancepopoverPage implements OnInit {

  arrinsurrance:any=[];
  arrchildinsurrance: any=[];
  constructor(public navCtrl: NavController,public valueGlobal:ValueGlobal,
    public gf: GlobalFunction,
    private router: Router,
    public popoverController: PopoverController,
    private callNumber: CallNumber) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    var se = this;
    var obj = se.gf.getParams('insurrenceHistory');
    if(obj){
      obj.listInsurrance.forEach(element => {
            se.arrinsurrance.push(element);
      });

      obj.childlist.forEach(element => {
        let itemchild = {claimed: element.claimedFlights && element.claimedFlights.length >1 ? true : false ,insurance_code: element.id,customer_name: element.name, customer_id: element.identification, customer_address: element.address, customer_dob: element.birth};
        se.arrchildinsurrance.push(itemchild);
      });
    }
  }
  async showInsurranceHistoryPopover(ev, item, ischild)
  {
    var se = this;
      const popover = await this.popoverController.create({
        component: InsurrancehistorypopoverPage,
        event: ev,
        translucent: true,
        cssClass: 'popover-history-popover'
      });
    let obj = se.gf.getParams('insurrenceHistory');
    obj.item = item;
    if(ischild){
        obj.childlist = [];
    }
    obj.ischild = ischild;
    se.gf.setParams(obj,'insurrenceDetail');
    return await popover.present();
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

    showInsurranceInfo(){
      var se = this;
      se.popoverController.dismiss();
      se.valueGlobal.popover.dismiss();
      se.navCtrl.navigateForward('/insurrancenote');
    }
}
