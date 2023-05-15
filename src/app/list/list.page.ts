import { Component, OnInit } from '@angular/core';
import { item } from '../item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  pushItem!: item;
  itemName: string = '';
  submitError: boolean = false;
  itemDesc: string = '';
  itemPrice: number = 0;

  constructor(public firestore: AngularFirestore, public nav: NavController) {}

  ngOnInit() {}
  submitFuction() {
    if (this.itemName != "" && this.itemDesc != "" && this.itemPrice >= 0 && this.itemPrice <= 2023 ){
      this.pushItem = {
        name: this.itemName,
        description: this.itemDesc,
        price: this.itemPrice,
        user: {
          name: "John Doe",
          uid: "",
          cart: []
        }
      }
      console.log("success");
      this.firestore.collection("items").add(
        this.pushItem
      ).then(()=>{
        this.nav.navigateForward("/home");
      })
    }
  }
}
