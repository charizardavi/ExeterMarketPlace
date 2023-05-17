import { Component, OnInit } from '@angular/core';
import { item } from '../item';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';
import { userProfile } from '../userProfile';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Preferences } from '@capacitor/preferences';

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
  uid: string = '';
  pushUser!: userProfile;

  constructor(
    public firestore: AngularFirestore,
    public nav: NavController,
    public auth: AngularFireAuth
  ) {}

  async ngOnInit() {
    const ret = await Preferences.get({ key: 'credentials' });
    const user = JSON.parse(ret.value!);
    if (user != null) {
      this.auth.signInWithEmailAndPassword(user.username, user.password);
    } else {
      this.nav.navigateRoot('/login');
    }
  }

  async submitFuction() {
    if (
      this.itemName != '' &&
      this.itemDesc != '' &&
      this.itemPrice >= 0 &&
      this.itemPrice <= 2023
    ) {
      const currentUser = await this.auth.currentUser;
      this.uid = currentUser!.uid;
      this.firestore
        .collection('users', (ref) => ref.where('uid', '==', this.uid))
        .get()
        .subscribe((data) =>
          data.forEach((dataPiece) => {
            this.pushUser = dataPiece.data() as unknown as userProfile;
            this.pushItem = {
              name: this.itemName,
              description: this.itemDesc,
              price: this.itemPrice,
              user: this.pushUser,
            };
            this.firestore
              .collection('items')
              .add(this.pushItem)
              .then(() => {
                this.nav.navigateForward('/home');
              });
          })
        );
    }
  }

  goToHome() {
    this.nav.navigateForward('/home');
  }
}
