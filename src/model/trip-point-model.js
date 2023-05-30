
export default class TripPointModel {

  static #emptyPoint = {
    'base_price': null,
    'date_from': null,
    'date_to': null,
    'destination': null,
    'id': null,
    'offers': null,
    'type': null
  };

  static get empty() {
    return TripPointModel.#emptyPoint;
  }

}
