import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {UnconfirmedTransaction} from "nem-library";

@Component({
  selector: 'transaction-modal',
  templateUrl: 'transaction.modal.html'
})
export class TransactionModal {
  unconfirmedTransaction: UnconfirmedTransaction;

  constructor(params: NavParams,
              public viewCtrl: ViewController) {
    this.unconfirmedTransaction = params.get('unconfirmedTransaction');
  }

  signTransaction() {
    this.viewCtrl.dismiss(true);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
