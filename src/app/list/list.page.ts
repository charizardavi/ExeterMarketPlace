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
  imageBase64: string = "";
  pushItem!: item;
  itemName: string = '';
  submitError: boolean = false;
  itemDesc: string = '';
  itemPrice: number = 0;
  uid: string = '';
  pushUser!: userProfile;
  pickup_location: string = "";


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
    let isSameName:boolean = false;
    this.firestore.collection("items").get().subscribe(
        data => data.forEach(
          dataPiece => {
            if ((dataPiece.data() as unknown as item).name == this.itemName){
              isSameName = true;
            }
          }
        )
      )

    if (
      this.itemName != '' &&
      this.itemDesc != '' &&
      this.itemPrice >= 0 &&
      this.itemPrice <= 2023 &&
      this.pickup_location != '' &&
      this.imageBase64 != "" &&
      !isSameName
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
              name: this.itemName.toLowerCase(),
              description: this.itemDesc,
              price: this.itemPrice,
              user: this.pushUser,
              image: this.imageBase64,
              pickup: this.pickup_location
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

  

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        this.imageBase64 = reader.result as string;
        console.log(this.imageBase64);
      };

      reader.readAsDataURL(file);
    }
  }
}
