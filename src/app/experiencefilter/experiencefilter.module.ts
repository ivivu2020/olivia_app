import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExperienceFilterPage } from './experiencefilter.page';

const routes: Routes = [
  {
    path: '',
    component: ExperienceFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExperienceFilterPage]
})
export class ExperienceFilterPageModule {}
