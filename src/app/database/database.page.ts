import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
})
export class DatabasePage implements OnInit {

  constructor(public firestore: AngularFirestore) { 
    console.log(firestore.collection("items"));
  }

  ngOnInit() {
    
  }

}
