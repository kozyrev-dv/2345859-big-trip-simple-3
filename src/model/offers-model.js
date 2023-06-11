import { UpdateType } from '../framework/utils/const';
import Observable from '../framework/observable';

export default class OffersModel extends Observable{

  #tripPointApiService = null;
  #offersByType = [];

  constructor(tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
  }

  getOffersOfType = (type) => this.#offersByType.find((el) => el.type === type).offers;

  get offersByType() {
    return this.#offersByType;
  }

  init = async () => {
    let res = true;
    try {
      this.#offersByType = await this.#tripPointApiService.getOffers();
    } catch(err) {
      this.#offersByType = [];
      res = false;
    }
    this._notify(UpdateType.INIT);
    return res;
  };

}
