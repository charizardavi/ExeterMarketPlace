import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { sideBarItem } from '../sidebarItem';
import { userProfile } from '../userProfile';
import { filter } from '../filter';
import { item } from '../item';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { NavController, RangeCustomEvent } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchText: string = 'normal';
  userCart: item[] = [];
  triggered: boolean = false;
  needsNewInit: boolean = false;
  priceCap: number = 500;
  totalListings: item[] = [];
  items: sideBarItem[] = [
    {
      name: 'dorm',
      icon: 'bed',
    },
    {
      name: 'education',
      icon: 'book-sharp',
    },
    {
      name: 'sports',
      icon: 'american-football-sharp',
    },
    {
      name: 'games',
      icon: 'game-controller-sharp',
    },
  ];
  profile: userProfile = {
    name: '',
    uid: '',
    cart: [],
  };

  filters: filter[] = [
    {
      name: 'price range',
      slider: true,
    }
  ];

  listings: item[] = [];

  constructor(
    public nav: NavController,
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   if (this.router.getCurrentNavigation()?.extras.state) {
    //     this.ngOnInit();
    //     console.log("yes");
    //   }
    // });
  }

  async ionViewDidEnter(){
    this.listings = [];
    this.triggered = true;
    const uid = (await this.auth.currentUser)?.uid!;
    if ((await this.auth.currentUser)?.uid == undefined) {
      this.nav.navigateRoot('/login');
    }

    this.firestore
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .get()
      .subscribe((data) =>
        data.forEach((dataPiece) => {
          this.profile = (dataPiece.data() as unknown as userProfile);
          this.userCart = (dataPiece.data() as unknown as userProfile).cart;
          console.log(this.userCart);
          this.firestore
            .collection('items')
            .get()
            .subscribe((data) =>
              data.forEach((dataPiece) => {
                // if (
                //   this.userCart.indexOf(dataPiece.data() as unknown as item) ==
                //   -1
                // ) {
                //   this.listings.push(dataPiece.data() as unknown as item);
                // }
                let addToArray = true;
                const incomingItem: item = dataPiece.data() as unknown as item;
                for (let cartItem of this.userCart){
                  if (cartItem.name == incomingItem.name){
                    addToArray = false;
                  }
                }
                if (addToArray){
                  this.listings.push(incomingItem);
                }
              })
            );
        })
      );
      this.totalListings = this.listings;
  }

  async ngOnInit() {
    
  }

  hello() {
    if (this.searchText == 'normal') {
      this.searchText = 'notNormal';
    } else {
      this.searchText = 'normal';
    }
  }

  goToListPage() {
    this.nav.navigateForward('/list');
  }

  handleInput(event: any) {
    this.searchText = event.target.value.toLowerCase();
    if (this.searchText != ""){
      let tempArray: item[] = [];
      for (let tempItem of this.totalListings){
        if (tempItem.name?.indexOf(this.searchText) != -1){
          tempArray.push(tempItem);
        }
      }
      this.listings = tempArray;
      this.totalListings = this.listings;
    }
    else{
      this.ionViewDidEnter();
    }
    
    // this.firestore.collection("items", ref => ref.where('name', '==', this.searchText)).get().subscribe(
    //   data => data.forEach(
    //     dataPiece => {
    //       this.listings.push((dataPiece.data() as unknown as item));
    //     }
    //   )
    // );
  }

  priceFilter(){

  }

  pinFormatter(value: number) {
    return `$${value}`;
  }

  onIonChange(ev: Event) {
    this.priceCap = (ev as RangeCustomEvent).detail.value.valueOf() as unknown as number;
    this.listings = [];
    for (let itemElement of this.totalListings){
      if (itemElement.price <= this.priceCap){
        this.listings.push(itemElement);
      }
    }
  }



  public expanded = false;
  public header = 'My Card Header';
  public description = 'My Card Description';
  public imageSrc = 'assets/images/earbuds.jpg';

  public toggleCard(): void {
    this.expanded = !this.expanded;
  }

  goToItem(passItem: item) {
    this.nav.navigateForward('/item', { state: passItem });
  }

  logOut() {
    this.auth.signOut();
    Preferences.remove({ key: 'credentials' });
    this.nav.navigateForward('/login');
  }

  cart() {
    this.nav.navigateForward('/cart');
  }
}
