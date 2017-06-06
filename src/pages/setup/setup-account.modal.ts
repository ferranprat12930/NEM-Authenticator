import {Component} from "@angular/core";
import {NavParams, ToastController, ViewController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'setup-account-modal',
  templateUrl: 'setup-account.modal.html'
})
export class SetupAccountModal {
  form: FormGroup;

  constructor(params: NavParams,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public viewCtrl: ViewController) {
    this.form = formBuilder.group({
      privateKey: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(64),
          Validators.maxLength(66)])]
    });
  }

  verifyAccount() {
    let privateKey: string = this.form.get('privateKey').value;
    if ((privateKey.length !== <number>64) && (privateKey.length !== <number>66)) {
      this.toastCtrl.create({
        message: "Check your private key",
        duration: 1000
      }).present();
    } else {
      this.viewCtrl.dismiss(privateKey);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
