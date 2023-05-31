import { randomInt, randomString } from '../framework/utils/random-utils';
import { OFFER_TYPES } from './const';

const createOffer = (id, title, price) => ({
  'id' : id,
  'title' : title,
  'price' : price
});

export {createOffer};
