import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { item } from '../item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { userProfile } from '../userProfile';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  buttonText: string = 'normal';

  public data!: item;

  public high_price!: number;

  public percentage!: number;

  public showAddCart: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    public nav: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.data = this.router.getCurrentNavigation()?.extras?.state as unknown as item;
        this.high_price = this.data.price+Math.ceil(Math.random()*(this.data.price/2)+1);
        this.percentage = Math.ceil(((this.high_price-this.data.price)/this.high_price)*100);
        if (this.data.fromCart){
          this.showAddCart = false;
        }
      }
      else{
        this.nav.navigateRoot("/home");
      }
      
    });
  }

  ngOnInit() {
    
  }
  hello() {
    if (this.buttonText == 'normal') {
      this.buttonText = 'notNormal';
    } else {
      this.buttonText = 'normal';
    }
  }

  handleInput(event: any) {
    this.buttonText = event.target.value.toLowerCase();
  }

  async addToCart() {
    console.log('click');

    const uid = (await this.auth.currentUser)?.uid;
    console.log(uid);
    this.showAddCart = false;
    this.firestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .get()
      .subscribe((data) =>
        data.forEach((dataPiece) => {
          let user: userProfile = dataPiece.data() as unknown as userProfile;
          user.cart.push(this.data);
          this.firestore
            .collection('users')
            .doc(dataPiece.id)
            .set(user)
            .then(() => {
              this.homeNav();
            });
        })
      );
  }

  async checkOut(){
    console.log('click');

    const uid = (await this.auth.currentUser)?.uid;
    console.log(uid);
    this.showAddCart = false;
    this.firestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .get()
      .subscribe((data) =>
        data.forEach((dataPiece) => {
          let user: userProfile = dataPiece.data() as unknown as userProfile;
          user.cart.push(this.data);
          this.firestore
            .collection('users')
            .doc(dataPiece.id)
            .set(user)
            .then(() => {
              this.nav.navigateForward("/cart");
            });
        })
      );
  }

  logOut(){
    this.auth.signOut();
    Preferences.remove({key:'credentials'});
    this.nav.navigateForward('/login');
  }

  homeNav(){
    this.nav.navigateForward('/home', { state: {hi: "yeah"} });
  }
}
