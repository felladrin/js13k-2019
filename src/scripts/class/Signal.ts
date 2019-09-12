/**
 * Copyright (c) 2018 Roger Paul <solidity@gmx.com>
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
export class Signal<T> {
  public slots: Function[] = [];
  public onces: Function[] = [];

  public add(slot: Function): Signal<T> {
    typeof slot === "function" && this.slots.push(slot);
    return this;
  }

  // public once(slot: Function): Signal<T> {
  //   typeof slot === "function" && this.onces.push(slot);
  //   return this;
  // }
  //
  // public remove(slot: Function): Signal<T> {
  //   this.slots = this.slots.filter(item => item !== slot);
  //   this.onces = this.onces.filter(item => item !== slot);
  //   return this;
  // }

  public emit(payload: T): void {
    this.notify(this.slots, payload);
    this.notify(this.onces, payload);
    this.onces = [];
  }

  /*
   * Use reverse loop with implicit comparison.
   * http://jsbench.github.io/#174d623c29798680e44b867dcf9732e7
   */
  public notify(slots: Function[], payload: T): void {
    for (let i = slots.length; i--; ) {
      const slot: Function = slots[i];
      slot.call(slot, payload || null);
    }
  }
}
