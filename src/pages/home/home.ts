import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {UnconfirmedTransactions} from "nem-library/dist/src/models/UnconfirmedTransactions";
import {AccountHttp} from "nem-library";
import {Observable} from "rxjs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  unconfirmedTransactions: UnconfirmedTransactions;
  private unconfirmedTransactionsEndpoint: Observable<any>;

  constructor(public navCtrl: NavController) {
    const accountHttp = new AccountHttp({domain: 'bob.nem.ninja'});
    this.unconfirmedTransactionsEndpoint = Observable.interval(5000).flatMap(x => {
      return accountHttp.unconfirmedTransactions('TAZM4LSMAHPDEKHJJO6MVMBQ3C2KCJME5A2DYFOJ');
    });
  }

  ngOnInit(): void {
    this.unconfirmedTransactionsEndpoint.subscribe(
      value => this.unconfirmedTransactions = value
    );
  }

}
