import Observable from '../framework/observable';
import { UpdateType } from '../moks/const';


export default class TripPointsModel extends Observable {

  #tripPointsApiService = null;
  #tripPoints = [];

  constructor(tripPointsApiService) {
    super();
    this.#tripPointsApiService = tripPointsApiService;

    // this.#tripPoints = Array.from({length: 20}, (_, index) => {
    //   const tripPoint = randomTripPoint(index);
    //   return {
    //     'basePrice' : tripPoint.base_price,
    //     'dateFrom' : tripPoint.date_from,
    //     'dateTo' : tripPoint.date_to,
    //     'destination': tripPoint.destination,
    //     'id': tripPoint.id,
    //     'offers': tripPoint.offers,
    //     'type': tripPoint.type
    //   };
    // });
  }

  getPoint = (id) => this.#tripPoints.find((el) => el.id === id);

  get tripPoints () {
    return this.#tripPoints;
  }

  init = async () => {
    try {
      const points = await this.#tripPointsApiService.getTripPoints();
      this.#tripPoints = points.map(this.#adaptToClient);
    } catch (err) {
      this.#tripPoints = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateTripPoint = async (updateType, update) => {
    const index = this.#tripPoints.findIndex((tripPoint) => tripPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting tripPoint');
    }

    try {

      const response = await this.#tripPointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#tripPoints = [
        ...this.tripPoints.slice(0, index),
        updatedPoint,
        ...this.#tripPoints.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update triPoint');
    }

  };

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

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;

  };

}
