const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

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

const tripPointSortType = {
  DAY: 'DAY',
  PRICE: 'PRICE'
};

export {EVENT_TYPES, FILTER_HEADERS, SORT_HEADERS, tripPointSortType, FilterType};
