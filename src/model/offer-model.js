
export default class OfferModel {

  #id = null;
  #price = null;
  #title = null;

  constructor(id, price, title) {
    this.#id = id;
    this.#price = price;
    this.#title = title;
  }

  get id() {
    return this.#id();
  }

  get price() {
    return this.#price;
  }

  get title() {
    return this.#title;
  }
}
