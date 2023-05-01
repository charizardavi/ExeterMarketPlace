import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  buttonText: string = "normal";
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
  

}
