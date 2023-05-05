import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  buttonText: string = "normal";
  constructor() { }

  ngOnInit() {}

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
