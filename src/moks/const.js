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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT:'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

export {EVENT_TYPES, FILTER_HEADERS, SORT_HEADERS, tripPointSortType, FilterType, UpdateType, UserAction};
