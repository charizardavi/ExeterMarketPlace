import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { item } from '../item';
import { userProfile } from '../userProfile';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
})
export class DatabasePage implements OnInit {
  myUser: userProfile = {
    name: "john doe",
    cart: [],
    uid: ""
  }
  
  myItem: item = {
    user: this.myUser,
    price: 10,
    description: "textbook",
  };
  constructor(public firestore: AngularFirestore, public auth: AngularFireAuth) { 
    
  }



  async ngOnInit() {
    console.log(this.firestore.collection("items"));
    // this.firestore.collection("items").add(
    //   this.myItem
    // )
    const mySearch = "textbook";
    let counter = 0;
    this.firestore.collection("items", ref => ref.where('description', '==', mySearch)).get().subscribe(
      data => data.forEach(
        dataPiece => {
          console.log((dataPiece.data() as unknown as item).description);
          counter = counter + 1;
          console.log(counter);
        }
      )
    )
  }

}
