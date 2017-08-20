/*
 * MIT License
 *
 * Copyright (c) 2017 Aleix Morgadas <aleixmorgadas@openmailbox.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {Component} from "@angular/core";
import {LoadingController, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SetupPage} from "../pages/setup/setup";
import {Storage} from "@ionic/storage";
import {HomePage} from "../pages/home/home";
import {NEMLibrary, NetworkTypes} from "nem-library";
import {TranslateService} from "@ngx-translate/core";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private storage: Storage,
              public loadingCtrl: LoadingController,
              private translateService: TranslateService) {

    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
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

      let availableLanguages = ['en', 'es'];

      //i18n configuration
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

