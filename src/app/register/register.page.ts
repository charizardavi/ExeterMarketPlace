import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { sendEmailVerification, getAuth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public firstNameValue: string = "";

  public lastNameValue: string = "";

  public emailValue: string = "";

  public passwordValue: string = "";
  
  auth: AngularFireAuth = inject(AngularFireAuth);


  constructor(public nav: NavController) {
  }

  ngOnInit() {
  }

  async createFunction() {
    if (this.firstNameValue != '' && this.lastNameValue != '' && this.passwordValue != '' && this.emailValue != '') {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailValue) && this.emailValue.indexOf("@exeter.edu") != -1) {
        this.auth.createUserWithEmailAndPassword(this.emailValue, this.passwordValue).then(
          async () => {
            console.log("WE GOT A USER");
            this.auth.signInWithEmailAndPassword(this.emailValue, this.passwordValue)
            console.log((await this.auth.currentUser)?.uid)
            const properUID = (await this.auth.currentUser)?.uid;
            await sendEmailVerification(getAuth().currentUser as unknown as User);
            this.nav.navigateForward('/login');
          }
        )
        .catch(
          (error) => {
            console.log("error from account creation below");
            console.log(error);
          }
        )
      }
      else{
        console.log("invalid credentials");
      }
    }
  }

}
