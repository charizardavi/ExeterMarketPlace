import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  buttonText: string = "normal";
  constructor() {}
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
}
