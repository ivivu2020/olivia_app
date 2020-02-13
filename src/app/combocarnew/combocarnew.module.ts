import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombocarnewPage } from './combocarnew.page';

const routes: Routes = [
  {
    path: '',
    component: CombocarnewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombocarnewPage]
})
export class CombocarnewPageModule {}
