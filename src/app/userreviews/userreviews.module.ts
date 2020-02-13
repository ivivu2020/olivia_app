import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserReviewsPage } from './userreviews';

@NgModule({
  declarations: [
    UserReviewsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserReviewsPage
    }]),
  ],
})
export class UserReviewsPageModule {}