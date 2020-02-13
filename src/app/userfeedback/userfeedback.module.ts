import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserFeedBackPage } from './userfeedback';

@NgModule({
  declarations: [
    UserFeedBackPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: UserFeedBackPage
    }]),
  ],
})
export class UserFeedBackPageModule {}