import { randomTripPoint } from '../moks/trip-point-moks';
import Observable from '../framework/observable';


export default class TripPointsModel extends Observable {

  #tripPoints = [];

  constructor() {
    super();
    this.#tripPoints = Array.from({length: 20}, (_, index) => {
      const tripPoint = randomTripPoint(index);
      return {
        'basePrice' : tripPoint.base_price,
        'dateFrom' : tripPoint.date_from,
        'dateTo' : tripPoint.date_to,
        'destination': tripPoint.destination,
        'id': tripPoint.id,
        'offers': tripPoint.offers,
        'type': tripPoint.type
      };
    });
  }

  getPoint = (id) => this.#tripPoints.find((el) => el.id === id);

  get tripPoints () {
    return this.#tripPoints;
  }

  updateTripPoint(updateType, update) {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting tripPoint');
    }

    this.#tripPoints = [
      ...this.tripPoints.slice(0, index),
      update,
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTripPoint(updateType, update) {
    this.#tripPoints = [
      update,
      ...this.#tripPoints
    ];

    this._notify(updateType, update);
  }

  deleteTripPoint(updateType, update) {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting tripPoint');
    }

    this.#tripPoints = [
      ...this.tripPoints.slice(0, index),
      ...this.#tripPoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
