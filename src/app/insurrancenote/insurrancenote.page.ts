import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-insurrancenote',
  templateUrl: './insurrancenote.page.html',
  styleUrls: ['./insurrancenote.page.scss'],
})
export class InsurranceNotePage implements OnInit {

  constructor(public router: Router,
    private callNumber: CallNumber) { }

  ngOnInit() {
  }

  goback(){
    this.router.navigateByUrl('/app/tabs/tab3?refresh=false');
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
