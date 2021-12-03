import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { FlatfileAdapterModule } from "@flatfile/angular";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FlatfileAdapterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
