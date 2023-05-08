import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatabasePageRoutingModule } from './database-routing.module';

import { DatabasePage } from './database.page';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatabasePageRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule
  ],
  declarations: [DatabasePage]
})
export class DatabasePageModule {}
