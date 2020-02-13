import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlightComboReviewsPage } from './flightcomboreviews';

@NgModule({
  declarations: [
    FlightComboReviewsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightComboReviewsPage
      }
    ])
  ],
})
export class FlightComboReviewsPageModule {}
