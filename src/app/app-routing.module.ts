import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {PickupCalendarPage } from '../app/pickup-calendar/pickup-calendar';

// const routes: Routes = [
//   { path: '', redirectTo: 'home', pathMatch: 'full' },
//   { path: 'home', loadChildren: './home/home.module#HomePageModule' },
//   { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
//   { path: 'tab1', loadChildren: './tab1/tab1.module#Tab1PageModule' },
//   { path: 'tab2', loadChildren: './tab2/tab2.module#Tab2PageModule' },
//   { path: 'tab3', loadChildren: './tab3/tab3.module#Tab3PageModule' },
//   { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
//   { path: 'tab5', loadChildren: './tab5/tab5.module#Tab5PageModule' },
// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// }) 
const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule', },
  //{ path: 'showmore', loadChildren: './tabs/tabs.module#TabsPageModule', },
  { path: 'pickup-calendar/:openfrommain', loadChildren: './pickup-calendar/pickup-calendar.module#PickupCalendarPageModule', },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', },
  { path: 'loginusername', loadChildren: './loginusername/loginusername.module#LoginusernamePageModule', },
  { path: 'occupancy', loadChildren: './occupancy/occupancy.module#OccupancyPageModule', },
  { path: 'searchhotel', loadChildren: './searchhotel/searchhotel.module#SearchHotelPageModule', },
  { path: 'searchhotelfilter', loadChildren: './search-hotel-filter/search-hotel-filter.module#SearchHotelFilterPageModule', },
  { path: 'searchhotelfilteragain', loadChildren: './search-hotel-filter-again/search-hotel-filter-again.module#SearchHotelFilterAgainPageModule', },
  { path: 'searchhotelfilterandsort', loadChildren: './search-hotel-filter-and-sort/search-hotel-filter-and-sort.module#SearchHotelFilterAndSortPageModule', },
  { path: 'hotellist/:filteragain', loadChildren: './hotel-list/hotel-list.module#HotelListPageModule', },
  { path: 'hotellistmood/:id/:title', loadChildren: './hotel-list-mood/hotel-list-mood.module#HotelListMoodPageModule', },
  { path: 'hoteldetail/:id', loadChildren: './hoteldetail/hoteldetail.module#HotelDetailPageModule', },
  { path: 'hotelroomdetail/:id', loadChildren: './hotelroomdetail/hotelroomdetail.module#HotelRoomDetailPageModule', },
  { path: 'hotelreviews/:id/:name', loadChildren: './hotelreviews/hotelreviews.module#HotelReviewsPageModule', },
  { path: 'hoteldescription/:id/:name', loadChildren: './description/description.module#DescriptionPageModule', },
  { path: 'facilities/:id/:name', loadChildren: './facilities/facilities.module#FacilitiesPageModule', },
  { path: 'policy/:id/:name', loadChildren: './policy/policy.module#PolicyPageModule', },
  //{ path: 'userprofile', loadChildren: './userprofile/userprofile.module#UserProfilePageModule', },
  { path: 'userreviews', loadChildren: './userreviews/userreviews.module#UserReviewsPageModule', },
  { path: 'userreward', loadChildren: './userreward/userreward.module#UserRewardPageModule', },
  { path: 'tripweather/:cityName', loadChildren: './weather/weather.module#WeatherPageModule', },
  { path: 'exchangegift/cityName', loadChildren: './exchangegift/exchangegift.module#ExchangeGiftPageModule', },
  { path: 'cuspoints', loadChildren: './cuspoints/cuspoints.module#CuspointsPageModule', },
  { path: 'mytripbookingdetail', loadChildren: './mytripbookingdetail/mytripbookingdetail.module#MytripBookingDetailPageModule', },
  { path: 'roomcancel', loadChildren: './roomcancel/roomcancel.module#RoomCancelPageModule', },
  { path: 'hotelnotes', loadChildren: './hotelnotes/hotelnotes.module#HotelNotesPageModule', },
  { path: 'hotelexpsnotes', loadChildren: './hotelexpsnotes/hotelexpsnotes.module#HotelExpsNotesPageModule', },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule',},
  { path: 'roomdetailreview', loadChildren: './roomdetailreview/roomdetailreview.module#RoomdetailreviewPageModule', },
  { path: 'roomadddetails', loadChildren: './roomadddetails/roomadddetails.module#RoomadddetailsPageModule', },
  { path: 'roomadddetails-ean', loadChildren: './roomadddetails-ean/roomadddetails-ean.module#RoomadddetailsEanPageModule', },
  { path: 'roompaymentselect', loadChildren: './roompaymentselect/roompaymentselect.module#RoompaymentselectPageModule', },
  { path: 'roompaymentselect-ean', loadChildren: './roompaymentselect-ean/roompaymentselect-ean.module#RoompaymentselectEanPageModule', },
  { path: 'roompaymentbank', loadChildren: './roompaymentbank/roompaymentbank.module#RoompaymentbankPageModule', },
  { path: 'roompaymentdone/:code/:stt', loadChildren: './roompaymentdone/roompaymentdone.module#RoompaymentdonePageModule', },
  { path: 'roompaymentlive', loadChildren: './roompaymentlive/roompaymentlive.module#RoompaymentlivePageModule', },
  { path: 'roomchoosebank', loadChildren: './roomchoosebank/roomchoosebank.module#RoomchoosebankPageModule', },
  { path: 'roompaymentdoneean/:code/:stt/:ischeck', loadChildren: './roompaymentdoneean/roompaymentdoneean.module#RoompaymentdoneeanPageModule', },
  { path: 'roompaymentbreakdown/:dur/:roomnumber', loadChildren: './roompaymentbreakdown/roompaymentbreakdown.module#RoompaymentbreakdownPageModule', },
  { path: 'flightcomboreviews', loadChildren: './flightcomboreviews/flightcomboreviews.module#FlightComboReviewsPageModule',},
  { path: 'flightdeparture', loadChildren: './flightdeparture/flightdeparture.module#FlightDeparturePageModule',},
  { path: 'flightcomboadddetails', loadChildren: './flightcomboadddetails/flightcomboadddetails.module#FlightComboAddDetailsPageModule',},
  { path: 'flightcombopaymentdone/:code/:stt/:flybookingcode', loadChildren: './flightcombopaymentdone/flightcombopaymentdone.module#FlightComboPaymentDonePageModule',},
  { path: 'forgotpassword', loadChildren: './forgotpassword/forgotpassword.module#ForgotPasswordPageModule',},
  { path: 'blog/:id', loadChildren: './blog/blog.module#BlogPageModule', },
  { path: 'usertravelhobby',loadChildren: './usertravelhobby/usertravelhobby.module#UserTravelHobbyPageModule',},
  { path: 'bloglist', loadChildren: './bloglist/bloglist.module#BlogListPageModule', },
  { path: 'topdeallist', loadChildren: './topdeallist/topdeallist.module#TopDealListPageModule', },
  { path: 'hotelreviewsimage', loadChildren: './hotelreviewsimage/hotelreviewsimage.module#HotelreviewsimagePageModule', },
  { path: 'experiencefilter', loadChildren: './experiencefilter/experiencefilter.module#ExperienceFilterPageModule' },
  { path: 'experiencesearch', loadChildren: './experiencesearch/experiencesearch.module#ExperienceSearchPageModule' },
  { path: 'experiencedetail', loadChildren: './experiencedetail/experiencedetail.module#ExperienceDetailPageModule' },
  { path: 'searchexperienceregion', loadChildren: './searchexperienceregion/searchexperienceregion.module#SearchExperienceRegionPageModule' },
  { path: 'searchblog', loadChildren: './searchblog/searchblog.module#SearchBlogPageModule' },
  { path: 'comboadddetails', loadChildren: './comboadddetails/comboadddetails.module#ComboadddetailsPageModule',},
  { path: 'combopayment', loadChildren: './combopayment/combopayment.module#CombopaymentPageModule' },
  { path: 'combodone/:code', loadChildren: './combodone/combodone.module#CombodonePageModule' },
  { path: 'carcombo', loadChildren: './carcombo/carcombo.module#CarComboPageModule', },
  { path: 'experiencedetail', loadChildren: './experiencedetail/experiencedetail.module#ExperienceDetailPageModule' },
  { path: 'searchexperienceregion', loadChildren: './searchexperienceregion/searchexperienceregion.module#SearchExperienceRegionPageModule' },
  { path: 'cardeparture', loadChildren: './cardeparture/cardeparture.module#CardeparturePageModule' },
  { path: 'combocarbank', loadChildren: './combocarbank/combocarbank.module#CombocarbankPageModule' },
  { path: 'combocarlive', loadChildren: './combocarlive/combocarlive.module#CombocarlivePageModule' },
  { path: 'loginsms', loadChildren: './loginsms/loginsms.module#LoginsmsPageModule' },
  { path: 'loginsmsverify', loadChildren: './loginsmsverify/loginsmsverify.module#LoginsmsverifyPageModule' },
  { path: 'forgotpass', loadChildren: './forgotpass/forgotpass.module#ForgotpassPageModule' },
  { path: 'forgotpassotp', loadChildren: './forgotpassotp/forgotpassotp.module#ForgotpassotpPageModule' },
  { path: 'forgotpasschange', loadChildren: './forgotpasschange/forgotpasschange.module#ForgotpasschangePageModule' },
  { path: 'insurrancepopover', loadChildren: './insurrancepopover/insurrancepopover.module#InsurrancepopoverPageModule' },
  { path: 'insurrancehistorypopover', loadChildren: './insurrancehistorypopover/insurrancehistorypopover.module#InsurrancehistorypopoverPageModule' },
  { path: 'insurrancedetail', loadChildren: './insurrancedetail/insurrancedetail.module#InsurrancedetailPageModule' },
  { path: 'insurrancedone', loadChildren: './insurrancedone/insurrancedone.module#InsurrancedonePageModule' },
  { path: 'insurrancenote', loadChildren: './insurrancenote/insurrancenote.module#InsurranceNotePageModule' },
  { path: 'combochoosebank', loadChildren: './combochoosebank/combochoosebank.module#CombochoosebankPageModule' },
  { path: 'combodoneprepay/:code/:stt/:ischeck', loadChildren: './combodoneprepay/combodoneprepay.module#CombodoneprepayPageModule' },
  { path: 'confirmotp', loadChildren: './confirmotp/confirmotp.module#ConfirmotpPageModule', },
  { path: 'combocarnew', loadChildren: './combocarnew/combocarnew.module#CombocarnewPageModule' },
  { path: 'combocarchangeplace', loadChildren: './combocarchangeplace/combocarchangeplace.module#CombocarchangeplacePageModule' },
  { path: 'registerverify', loadChildren: './registerverify/registerverify.module#RegisterverifyPageModule' },
  { path: 'popupinfobkg', loadChildren: './popupinfobkg/popupinfobkg.module#PopupinfobkgPageModule' },
  { path: 'adddiscount', loadChildren: './adddiscount/adddiscount.module#AdddiscountPageModule' }
];
@NgModule({
  imports:
    [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
  exports:
    [
      RouterModule
    ]
})
export class AppRoutingModule { }
