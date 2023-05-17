import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { item } from '../item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  buttonText: string = "normal";

  public data!: item;
 
  constructor(private route: ActivatedRoute, private router: Router, public firestore: AngularFirestore, public auth: AngularFireAuth) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras?.state as unknown as item;
      }
    });
  }

  ngOnInit() {
  }
  hello(){
    if (this.buttonText == "normal"){
      this.buttonText = "notNormal";
    }
    else{
      this.buttonText = "normal";
    }
  }

  handleInput(event: any){
    this.buttonText = event.target.value.toLowerCase();
  }

  addToCart(){
    // this.firestore.collection("items").add();
    // console.log(this.firestore.collection("items").get());
    
  }

}
