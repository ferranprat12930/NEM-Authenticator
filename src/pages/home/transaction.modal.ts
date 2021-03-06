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
import {NavParams, ViewController} from "ionic-angular";
import {MultisigTransaction} from "nem-library";
import {TransactionTypes} from "nem-library/dist/src/models/transaction/TransactionTypes";

@Component({
  selector: 'transaction-modal',
  templateUrl: './transaction.modal.html'
})
export class TransactionModal {
  unconfirmedTransaction: MultisigTransaction;
  TransactionTypes = TransactionTypes;

  constructor(params: NavParams,
              public viewCtrl: ViewController) {
    this.unconfirmedTransaction = <MultisigTransaction>params.get('unconfirmedTransaction');
  }

  signTransaction() {
    this.viewCtrl.dismiss(true);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
