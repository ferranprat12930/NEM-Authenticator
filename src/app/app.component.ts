import {Component} from "@angular/core";
import {LoadingController, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SetupPage} from "../pages/setup/setup";
import {Storage} from "@ionic/storage";
import {HomePage} from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private storage: Storage,
              public loadingCtrl: LoadingController) {
    let loader = loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    storage.get('PRIVATE_KEY').then(privateKey => {
      loader.dismiss();
      if (privateKey !== null) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = SetupPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

