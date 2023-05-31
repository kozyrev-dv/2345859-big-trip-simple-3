import { randomString } from '../framework/utils/random-utils';

const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FILTER_HEADERS = {
  'future': 'Future',
  'everything': 'Everything'
};

const SORT_HEADERS = {
  'day': 'Day',
  'event': 'Event',
  'time': 'Time',
  'price': 'Price',
  'offer': 'Offers'
};

const DESTINATIONS = Array.from({length: 10}, (_, i) => ({
  'id': i,
  'description': randomString(20),
  'name': randomString(10),
  'pictures': [
    {
      'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
      'description': 'Chamonix parliament building'
    }
  ]
}));

export {OFFER_TYPES, FILTER_HEADERS, SORT_HEADERS, DESTINATIONS};
