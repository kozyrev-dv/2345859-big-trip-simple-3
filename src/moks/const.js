
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

const allOffers = Array.from({length: 10}, (_, i) => (
  {
    'id' : i,
    'title' : 'Upgrade to a business class',
    'price' : Math.random() * 100
  }));

export {OFFER_TYPES, FILTER_HEADERS, SORT_HEADERS,allOffers};
