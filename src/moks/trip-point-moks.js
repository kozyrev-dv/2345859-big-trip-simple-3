import { nanoid } from 'nanoid';
import { randomInt} from '../framework/utils/random-utils';
import { EVENT_TYPES} from './const';
import dayjs from 'dayjs';

const randomTripPoint = () => ({
  'base_price': randomInt(1000, 100),
  'date_from': dayjs('2019-07-10T22:55:56.845Z').add(randomInt(96, 12), 'hour').toString(),
  'date_to': dayjs('2019-07-10T22:55:56.845Z').add(randomInt(48, 96), 'hour').toString(),
  'destination': randomInt(10),
  'id': nanoid(),
  'offers': Array.from({length: Math.floor(Math.random() * 2)}, () => Math.floor(Math.random() * 2)),
  'type': EVENT_TYPES[randomInt(EVENT_TYPES.length)]
});

export {randomTripPoint};
