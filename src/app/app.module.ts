import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './map-view/map-view.component';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { FilterPipe } from './map-view/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAFgM81Qz-SwfTzUsr4F51AgDj0HdN88CQ'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
