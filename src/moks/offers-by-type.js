import { randomInt, randomString } from '../framework/utils/random-utils';
import { OFFER_TYPES } from './const';


const createOffer = (id, title, price) => ({
  'id' : id,
  'title' : title,
  'price' : price
});

const OFFERS_BY_TYPES = Array.from(OFFER_TYPES, (type) => {
  const offers = Array.from(
    {length: randomInt(5, 1)},
    (_, index) => createOffer(index, randomString(10), randomInt(100, 10))
  );
  return {
    'type': type,
    'offers': offers
  };
});

export {OFFERS_BY_TYPES};
