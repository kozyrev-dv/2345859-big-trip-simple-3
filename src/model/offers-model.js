import { EVENT_TYPES } from '../moks/const';
import { randomInt, randomString } from '../framework/utils/random-utils';
import { createOffer } from '../moks/offers-by-type-moks';

export default class OffersModel {

  #offersByType = [];

  constructor() {
    this.#offersByType = Array.from(EVENT_TYPES, (type) => {
      const offers = Array.from(
        {length: randomInt(5, 2)},
        (_, index) => createOffer(index, randomString(10), randomInt(100, 10))
      );
      return {
        'type': type,
        'offers': offers
      };
    });
  }

  getOffersOfType = (type) => this.#offersByType.find((el) => el.type === type).offers;

  get offersByType() {
    return this.#offersByType;
  }
}
