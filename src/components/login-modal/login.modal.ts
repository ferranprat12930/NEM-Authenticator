import {Component} from "@angular/core";
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Keyboard} from '@ionic-native/keyboard';
import {Address, NEMLibrary, NetworkTypes, SimpleWallet} from "nem-library";
import {Password} from "nem-library/dist/src/models/wallet/Password";
import {TranslateService} from "@ngx-translate/core";

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
              private viewCtrl: ViewController,
              private keyboard: Keyboard,
              private translateService: TranslateService) {
    this.form = formBuilder.group({
      password: ['',
        Validators.compose([Validators.required])]
    });
    this.wallet = <SimpleWallet>params.get('wallet');
    this.multisig = <Address>params.get('multisig');
  }

  login() {

    this.keyboard.close();
    try {
      const password = new Password(this.form.get('password').value);
      const account = this.wallet.open(password);
      if (!account.address.equals(this.wallet.address)) {
        throw new Error("ERROR_PASSWORD");
      }
      this.viewCtrl.dismiss(account);
    } catch (e) {
      this.translateService.get("ERROR_PASSWORD").subscribe(value => {
        this.toastCtrl.create({
          message: value,
          duration: 2000
        }).present();
      });
    }
  }
}
