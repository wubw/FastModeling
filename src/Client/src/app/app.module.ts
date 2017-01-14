import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DefaultshapeComponent } from './defaultshape.component';
import { ModelViewerComponent } from './modelviewer.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultshapeComponent,
    ModelViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
