const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FILTER_HEADERS = {
  'future': 'Future',
  'everything': 'Everything'
};

const FilterType = {
  FUTURE: 'FUTURE',
  EVERYTHING: 'EVERYTHING'
};

const SORT_HEADERS = {
  'day': 'Day',
  'event': 'Event',
  'time': 'Time',
  'price': 'Price',
  'offer': 'Offers'
};

const SortType = {
  DAY: 'DAY',
  PRICE: 'PRICE'
};

export {OFFER_TYPES, FILTER_HEADERS, SORT_HEADERS, SortType, FilterType};
