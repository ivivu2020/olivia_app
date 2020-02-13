import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoomdetailreviewPage } from './roomdetailreview';

@NgModule({
  declarations: [
    RoomdetailreviewPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoomdetailreviewPage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RoomdetailreviewPageModule {}
