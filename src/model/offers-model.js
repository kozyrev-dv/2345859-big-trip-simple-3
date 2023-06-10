import { UpdateType } from '../moks/const';
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

    try {
      this.#offersByType = await this.#tripPointApiService.getOffers();
    } catch(err) {
      this.#offersByType = [];
    }
    this._notify(UpdateType.INIT);

  };

}
