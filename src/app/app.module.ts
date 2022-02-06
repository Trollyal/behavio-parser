import { AppComponent, NodeNamePipe } from './app.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTreeModule } from '@angular/material/tree'
import { NgModule } from '@angular/core'
import { SexpParserService } from 'src/services/sexpParser.service'

@NgModule({
  declarations: [
    AppComponent,
    NodeNamePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [SexpParserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
