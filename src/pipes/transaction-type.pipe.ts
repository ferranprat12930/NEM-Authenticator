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

import {Pipe, PipeTransform} from "@angular/core";
import {TransactionTypes} from "nem-library";

@Pipe({name: 'transactionType'})
export class TransactionTypePipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    if (value == TransactionTypes.TRANSFER) return "TRANSFER";
    else if (value == TransactionTypes.IMPORTANCE_TRANSFER) return "IMPORTANCE_TRANSFER";
    else if (value == TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION) return "MULTISIG_AGGREGATE_MODIFICATION";
    else if (value == TransactionTypes.PROVISION_NAMESPACE) return "PROVISION_NAMESPACE";
    else if (value == TransactionTypes.MOSAIC_DEFINITION_CREATION) return "MOSAIC_DEFINITION_CREATION";
    else if (value == TransactionTypes.MOSAIC_SUPPLY_CHANGE) return "MOSAIC_SUPPLY_CHANGE";
  }
}
