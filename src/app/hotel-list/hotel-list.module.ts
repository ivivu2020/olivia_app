import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelListPage } from './hotel-list';

@NgModule({
  declarations: [
    HotelListPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HotelListPage
      }
    ])
  ],
})
export class HotelListPageModule {}
