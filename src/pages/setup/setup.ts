import {Component, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController, NavController, Slides, ToastController} from "ionic-angular";
import {Account} from "nem-library";
import {Storage} from "@ionic/storage";
import {HomePage} from "../home/home";
import {SetupAccountModal} from "./setup-account.modal";

@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html'
})
export class SetupPage {
  form: FormGroup;
  @ViewChild(Slides) slides: Slides;
  account: Account;
  privateKey: string;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private storage: Storage) {
    this.form = formBuilder.group({
      myAccount: [false, Validators.requiredTrue]
    });
  }

  confirm() {
    this.storage.set('PRIVATE_KEY', this.privateKey).then(x => {
        this.navCtrl.setRoot(HomePage);
      }
    );
  }

  openSetupAccountModal() {
    let modal = this.modalCtrl.create(SetupAccountModal);
    modal.onDidDismiss((privateKey) => {
      if (privateKey != null) {
        this.privateKey = privateKey;
        this.account = Account.generateWithPrivateKey(privateKey);
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext(500);
      }
    });
    modal.present();
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 2 && this.account === undefined) {
      this.slides.lockSwipeToNext(true);
    } else {
      this.slides.lockSwipeToNext(false);
    }
  }
}
