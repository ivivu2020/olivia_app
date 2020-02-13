import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExperienceSearchPage } from './experiencesearch.page';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';
const routes: Routes = [
  {
    path: '',
    component: ExperienceSearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonBottomDrawerModule
  ],
  declarations: [ExperienceSearchPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ExperienceSearchPageModule {}
