import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { item } from '../item';
import { userProfile } from '../userProfile';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: item[] = [];
  uid: string = '';

  constructor(
    public nav: NavController,
    public firestore: AngularFirestore,
    public auth: AngularFireAuth
  ) {}

  async ngOnInit() {
    const ret = await Preferences.get({ key: 'credentials' });
    const user = JSON.parse(ret.value!);
    if (user != null && user.auto) {
      console.log('nonull');
      this.auth
        .signInWithEmailAndPassword(user.username, user.password)
        .then(async () => {
          this.uid = (await this.auth.currentUser)?.uid!;

          this.firestore
            .collection('users', (ref) => ref.where('uid', '==', this.uid))
            .get()
            .subscribe((data) =>
              data.forEach((dataPiece) => {
                this.cart = (dataPiece.data() as unknown as userProfile).cart;
                console.log(this.cart);
              })
            );
        });
    }
  }

  logOut() {
    this.auth.signOut();
    Preferences.remove({ key: 'credentials' });
    this.nav.navigateForward('/login');
  }

  deleteItem(name: string){
    for (let myItem of this.cart){
      if (myItem.name == name){
        const index = this.cart.indexOf(myItem);
        this.cart.splice(index, 1);
        break;
      }
    }

    this.firestore
      .collection('users', (ref) => ref.where('uid', '==', this.uid))
      .get()
      .subscribe((data) =>
        data.forEach((dataPiece) => {
          let user: userProfile = dataPiece.data() as unknown as userProfile;
          user.cart = this.cart;
          this.firestore
            .collection('users')
            .doc(dataPiece.id)
            .set(user);
        })
      );
  }

  checkOut(){
    for (let myItem of this.cart){
      this.firestore
      .collection('items', (ref) => ref.where('name', '==', myItem.name))
      .get()
      .subscribe((data) =>
        data.forEach((dataPiece) => {          
          this.firestore
            .collection('users')
            .doc(dataPiece.id)
            .delete();
        })
      );
    }
  }
  homeNav(){
    this.nav.navigateBack("/home");
  }
}
