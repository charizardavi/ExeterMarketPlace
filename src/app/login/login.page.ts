import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  auth: AngularFireAuth = inject(AngularFireAuth);
  emailValue: string = "";
  passwordValue: string = "";

  saveLoginInfo: boolean = true;
  isChecked: boolean = true;

  userCaddieDataTemp: any[] = [];

  loginError: boolean = false;

  constructor(public nav: NavController) {
  }

  async ngOnInit() {
    const ret = await Preferences.get({ key: 'credentials' });
    const user = JSON.parse(ret.value!);
    if (user != null){
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
                  password: this.passwordValue
                }
              )
            }
          )
        }
        else {
          Preferences.remove({key:'credentials'});
        }
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
