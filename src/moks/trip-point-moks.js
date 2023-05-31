import TripPointModel from '../model/trip-point-model';
import { randomInt} from '../framework/utils/random-utils';
import { OFFER_TYPES, DESTINATIONS } from './const';

const randomTripPoint = () => new TripPointModel(
  randomInt(1000, 100),
  '2019-07-10T22:55:56.845Z',
  '2019-07-11T11:22:13.375Z',
  randomInt(DESTINATIONS.length),
  '0',
  Array.from({length: Math.floor(Math.random() * 2)}, () => Math.floor(Math.random() * 2)),
  OFFER_TYPES[randomInt(OFFER_TYPES.length)]
);

export {randomTripPoint};
