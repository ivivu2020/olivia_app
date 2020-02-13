import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { HotelListPageModule } from '../hotel-list/hotel-list.module';
import { HotelDetailPageModule } from '../hoteldetail/hoteldetail.module';
import { HotelListMoodPageModule } from '../hotel-list-mood/hotel-list-mood.module';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //RouterModule.forChild(routes)
    TabsPageRoutingModule,
    HotelListPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
