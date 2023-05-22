import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { item } from '../item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { userProfile } from '../userProfile';

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

  async addToCart(){
    // this.firestore.collection("items").add();
    // console.log(this.firestore.collection("items").get());
    console.log("click");
    let pushUser: userProfile;

    const uid = (await this.auth.currentUser)?.uid;
    console.log(uid);
    this.firestore.collection("users", ref => ref.where('uid', '==', uid)).get().subscribe(
      data => data.forEach(
        dataPiece => {
          let user:userProfile = dataPiece.data() as unknown as userProfile;
          user.cart.push(this.data);
          this.firestore.collection("users").doc(dataPiece.id).set(user);
        }
      )
    )
  }

}
