import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  // Listitem: item = {
  //   user: this.Listitem,
  //   price: 10,
  //   description: "textbook",
  // };
  emailValue: string = "";
  loginError: boolean = false;


  constructor() { }

  ngOnInit() {
  }
  loginFunction(){

  }

}
