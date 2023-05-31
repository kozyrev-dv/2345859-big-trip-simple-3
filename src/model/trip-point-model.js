import { randomTripPoint } from '../moks/trip-point-moks';

export default class TripPointsModel {

  #tripPoints = [];

  constructor() {
    this.#tripPoints = Array.from({length: 20}, (_, index) => randomTripPoint(index));
  }

  getPoint = (id) => this.#tripPoints.find((el) => el.id === id);
}
