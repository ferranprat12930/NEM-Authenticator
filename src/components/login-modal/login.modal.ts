import {Component} from "@angular/core";
import {ModalController, NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Address, NEMLibrary, NetworkTypes, SimpleWallet} from "nem-library";
import {Password} from "nem-library/dist/src/models/wallet/Password";

@Component({
  selector: 'login-modal',
  templateUrl: 'login.modal.html'
})
export class LoginModal {
  NEMLibrary = NEMLibrary;
  NetworkTypes = NetworkTypes;

  form: FormGroup;
  wallet: SimpleWallet;
  multisig: Address;

  constructor(params: NavParams,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private barcodeScanner: BarcodeScanner,
              private viewCtrl: ViewController) {
    this.form = formBuilder.group({
      password: ['',
        Validators.compose([Validators.required])]
    });
    this.wallet = <SimpleWallet>params.get('wallet');
    this.multisig = <Address>params.get('multisig');
  }

  login() {
    try {
      let password = new Password(this.form.get('password').value);
      let account = this.wallet.open(password);
      this.viewCtrl.dismiss(account);
    } catch (e) {
      this.toastCtrl.create({
        message: "The password is invalid",
        duration: 2000
      }).present();
    }
  }
}