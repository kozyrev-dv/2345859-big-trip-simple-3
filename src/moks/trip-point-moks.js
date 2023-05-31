import { randomInt} from '../framework/utils/random-utils';
import { OFFER_TYPES, DESTINATIONS } from './const';

const randomTripPoint = (id) => ({
  'base_price': randomInt(1000, 100),
  'date_from': '2019-07-10T22:55:56.845Z',
  'date_to': '2019-07-11T11:22:13.375Z',
  'destination': randomInt(DESTINATIONS.length),
  'id': id,
  'offers': Array.from({length: Math.floor(Math.random() * 2)}, () => Math.floor(Math.random() * 2)),
  'type': OFFER_TYPES[randomInt(OFFER_TYPES.length)]
});

export {randomTripPoint};
