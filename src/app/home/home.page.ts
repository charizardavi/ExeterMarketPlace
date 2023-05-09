import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { sideBarItem } from '../sidebarItem';
import { userProfile } from '../userProfile';
import { filter } from '../filter';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  buttonText: string = "normal";
  items: sideBarItem[] = [
    {
      name: "dorm",
      icon: "bed"
    },
    {
      name: "education",
      icon: "book-sharp"
    },
    {
      name: "sports",
      icon: "american-football-sharp"
    },
    {
      name: "games",
      icon: "game-controller-sharp"
    }
  ];
  profile: userProfile = {
    name: "Avaninder",
    uid: "",
    cart: []
  };

  filters: filter[] = [
    {
      name: "price range",
      slider: true
    },
    {
      name: "hello there",
      slider: true
    }
  ]

  firestore: AngularFirestore = inject(AngularFirestore);
  constructor() {
    
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
  pinFormatter(value: number) {
    value = value*10;
    return `$${value}`;
  }
  public expanded = false;
  public header = 'My Card Header';
  public description = 'My Card Description';
  public imageSrc = 'assets/images/earbuds.jpg';

  public toggleCard(): void {
    this.expanded = !this.expanded;
  }

}
