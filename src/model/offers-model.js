import { UpdateType } from '../moks/const';
import Observable from '../framework/observable';

export default class OffersModel extends Observable{

  #tripPointApiService = null;
  #offersByType = [];

  constructor(tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
    // this.#offersByType = Array.from(EVENT_TYPES, (type) => {
    //   const offers = Array.from(
    //     {length: randomInt(5, 2)},
    //     (_, index) => createOffer(index, randomString(10), randomInt(100, 10))
    //   );
    //   return {
    //     'type': type,
    //     'offers': offers
    //   };
    // });
  }

  getOffersOfType = (type) => this.#offersByType.find((el) => el.type === type).offers;

  get offersByType() {
    return this.#offersByType;
  }

  init = async () => {

    try {
      this.#offersByType = await this.#tripPointApiService.offers;
    } catch(err) {
      this.#offersByType = [];
    }
    this._notify(UpdateType.INIT);

  };

}
