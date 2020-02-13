import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelRoomDetailPage } from './hotelroomdetail';

@NgModule({
  declarations: [
    HotelRoomDetailPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HotelRoomDetailPage
      }
    ])
  ],
})
export class HotelRoomDetailPageModule {}
