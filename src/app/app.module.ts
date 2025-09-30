import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {App} from './app';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [],
  imports: [BrowserModule, App, TableModule, InputTextModule, ButtonModule],
  providers: [],
  bootstrap: [App]
})
export class AppModule {}
