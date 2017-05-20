import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UnconfirmedTransactions} from "nem-library/dist/src/models/UnconfirmedTransactions";
import {AccountHttp} from "nem-library";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  unconfirmedTransactions: UnconfirmedTransactions;

  constructor(public navCtrl: NavController) {
    const accountHttp = new AccountHttp();
    accountHttp.unconfirmedTransactions('TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ')
      .subscribe(
        value => this.unconfirmedTransactions = value
      )
  }

}
