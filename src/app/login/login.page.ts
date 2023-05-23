import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { userProfile } from '../userProfile';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  myUser: userProfile = {
    name: "",
    cart: [],
    uid: ""
  }
  emailValue: string = "";
  passwordValue: string = "";

  saveLoginInfo: boolean = true;
  isChecked: boolean = true;

  userCaddieDataTemp: any[] = [];

  loginError: boolean = false;

  constructor(public nav: NavController, public auth: AngularFireAuth) {
  }

  async ngOnInit() {
    const ret = await Preferences.get({ key: 'credentials' });
    const user = JSON.parse(ret.value!);
    if (user != null && user.auto){
      console.log("nonull");
      this.auth.signInWithEmailAndPassword(user.username, user.password).then(
        async () => {
          const uid = (await this.auth.currentUser)?.uid;
          this.nav.navigateForward("/home")
        }
      )
    }
  }

  async loginFunction() {
    this.auth.signInWithEmailAndPassword(this.emailValue, this.passwordValue).then(
      async () => {
        console.log((await this.auth.currentUser)?.uid)
        if (this.isChecked) {
          await Preferences.set(
            {
              key: 'credentials',
              value: JSON.stringify(
                {
                  username: this.emailValue,
                  password: this.passwordValue,
                  auto: true
                }
              )
            }
          );
        }
        else{
          await Preferences.set(
            {
              key: 'credentials',
              value: JSON.stringify(
                {
                  username: this.emailValue,
                  password: this.passwordValue,
                  auto: false
                }
              )
            }
          )
        }
        // else {
        //   Preferences.remove({key:'credentials'});
        // }
        const uid = (await this.auth.currentUser)?.uid;
          this.nav.navigateForward("/home");
      }
    )
      .catch(
        () => {
          this.loginError = true;
          console.log("error");
        }
      )

  }

  goToRegister() {
    this.nav.navigateForward('/register');
  }

  async saveLoginChange(event:any) {
    this.isChecked = event.detail.checked;
  }

}

// <ion-text color="secondary" class="ion-text-center login-logo">
//     <h1>Login</h1>
//   </ion-text>

//   <form>
//     <!-- <ion-card id="top-area-card">
//       <ion-card-content class="ion-text-center"> -->
//         <ion-item lines="full" class="email-form">
//           <ion-label position="floating">Email</ion-label>
//           <ion-input [(ngModel)]="emailValue" name="firstName" type="text"></ion-input>
//         </ion-item>
//       <!-- </ion-card-content>
//     </ion-card> -->

//     <!-- <ion-card id="top-area-card">
//       <ion-card-content class="ion-text-center"> -->
//         <ion-item lines="full" class="password-form">
//           <ion-label position="floating">Password</ion-label>
//           <ion-input [(ngModel)]="passwordValue" name="firstName" type="text"></ion-input>
//         </ion-item>
//       <!-- </ion-card-content>
//     </ion-card> -->

//     <!-- <ion-card id="top-area-card">
//       <ion-card-content class="ion-text-center"> -->
//         <ion-row class="login-info-save">
//           <ion-col>
//             <ion-item>
//               <ion-checkbox [(ngModel)]="saveLoginInfo" [ngModelOptions]="{standalone: true}" slot="start" (ionChange)="saveLoginChange($event)"></ion-checkbox>
//               <ion-label class="ion-text-wrap">Save my login information</ion-label>
//             </ion-item>
//           </ion-col>
//         </ion-row>
//       <!-- </ion-card-content>
//     </ion-card> -->

//     <ion-row>
//       <ion-col>
//         <ion-button (click)="goToRegister()" fill="clear" type="submit" expand="block">Don't have an account? Register
//           here</ion-button>
//       </ion-col>
//     </ion-row>

//     <ion-row class="submit-button">
//       <ion-col>
//         <ion-button (click)="loginFunction()" type="submit" color="light" expand="block">submit</ion-button>
//       </ion-col>
//     </ion-row>
//   </form>

//   <ion-text color="danger" class="ion-text-center login-logo" *ngIf="loginError">
//     <p>The email or password are incorrect</p>
//   </ion-text>