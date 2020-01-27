import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { environment } from '@web-environment/environment';
import * as enDateLocale from 'date-fns/locale/en-US';
import {
  en_US,
  NzMessageModule,
  NzNotificationModule,
  NZ_DATE_LOCALE,
  NZ_I18N
} from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppInterceptorService } from './common-objects/common-attributes/app-interceptor.service';
import { GraphQLModule } from './graphql/graphql.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    ShellModule,
    NzNotificationModule,
    NzMessageModule,
    environment.production
      ? [AkitaNgRouterStoreModule]
      : [AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule],
    GraphQLModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_DATE_LOCALE, useValue: enDateLocale },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
