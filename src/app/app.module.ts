import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MappingMasterModule } from './mapping-master/mapping-master.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './core/interceptors/http-interceptor.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    MappingMasterModule
  ],providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true  // Ensures multiple interceptors can be used
    }
  ],
})
export class AppModule { }
