export default class TripPointModel {

  #basePrice = null;
  #dateFrom = null;
  #dateTo = null;
  #destination = null;
  #id = null;
  #offers = null;
  #type = null;

  constructor(basePrice, dateFrom, dateTo, destination, id, offers, type) {
    this.#basePrice = basePrice;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#destination = destination;
    this.#id = id;
    this.#offers = offers;
    this.#type = type;
  }

  get basePrice() {
    return this.#basePrice;
  }

  get dateFrom() {
    return this.#dateFrom;
  }

  get dateTo() {
    return this.#dateTo;
  }

  get destination() {
    return this.#destination;
  }

  get id() {
    return this.#id;
  }

  get offers() {
    return this.#offers;
  }

  get type() {
    return this.#type;
  }

}
