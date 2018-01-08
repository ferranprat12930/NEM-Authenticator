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
import {Component, Input, OnInit} from "@angular/core";
import {TransferTransaction} from "nem-library/dist/src/models/transaction/TransferTransaction";
import {AccountOwnedMosaicsService, MosaicHttp, MosaicService, MosaicTransferable, XEM} from "nem-library";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'transfer-transaction-component',
  templateUrl: './transfer-transaction.component.html'
})
export class TransferTransactionComponent implements OnInit {
  @Input() transaction: TransferTransaction;
  mosaics: MosaicTransferable[] = [];

  ngOnInit(): void {
    if (this.transaction.containsMosaics()) {
      const mosaicHttp = new MosaicHttp();
      Observable.of(this.transaction.mosaics())
        .flatMap(_ => _)
        .flatMap((mosaic) => {
          if (XEM.MOSAICID.equals(mosaic.mosaicId)) return Observable.of(new XEM(mosaic.quantity / Math.pow(10, 6)));
          else {
            return mosaicHttp.getMosaicDefinition(mosaic.mosaicId)
              .map((mosaicDefinition) => {
                return MosaicTransferable.createWithMosaicDefinition(mosaicDefinition, mosaic.quantity / Math.pow(10, mosaicDefinition.properties.divisibility));
              });
          }
        })
        .subscribe(mosaicTransferable => this.mosaics.push(mosaicTransferable));
    }
  }
}
