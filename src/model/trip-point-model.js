import { randomTripPoint } from '../moks/trip-point-moks';

export default class TripPointsModel {

  #tripPoints = [];

  constructor() {
    this.#tripPoints = Array.from({length: 0}, (_, index) => {
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

}
