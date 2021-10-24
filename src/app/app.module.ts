import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectComponent } from './select/select.component';
import { SelectOptionComponent } from './select/select-option/select-option.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [AppComponent, SelectComponent, SelectOptionComponent],
  imports: [OverlayModule, BrowserModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
