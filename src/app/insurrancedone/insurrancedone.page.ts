import { Component, OnInit } from '@angular/core';
import { GlobalFunction } from '../providers/globalfunction';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-insurrancedone',
  templateUrl: './insurrancedone.page.html',
  styleUrls: ['./insurrancedone.page.scss'],
})
export class InsurrancedonePage implements OnInit {
  paramReturn: any;

  constructor(public gf: GlobalFunction, public modalCtrl: ModalController,
    public router: Router) { 
    this.paramReturn = this.gf.getParams('insurranceClaimed');
  }

  ngOnInit() {
  }
  next()
  {
    //this.modalCtrl.dismiss(this.paramReturn);

    let navigationExtras: NavigationExtras = {
      state: {
        param: this.paramReturn
      }
    };
    //this.router.navigate(['details'], navigationExtras);
    this.router.navigateByUrl("/app/tabs/tab3?refresh=true", navigationExtras);
  }

}
