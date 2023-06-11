import Observable from '../framework/observable';
import { UpdateType } from '../framework/utils/const';

export default class DestinationsModel extends Observable{

  #tripPointApiService = null;
  #destinations = [];

  constructor(tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    let res = true;
    try {
      this.#destinations = await this.#tripPointApiService.getDestinations();
    } catch(err) {
      this.#destinations = [];
      res = false;
    }
    this._notify(UpdateType.INIT);
    return res;
  };

}
