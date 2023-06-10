const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  FUTURE: 'FUTURE',
  EVERYTHING: 'EVERYTHING'
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
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EventFormViewMode = {
  CREATE: 'CREATE',
  EDIT: 'EDIT'
};

export {EVENT_TYPES, tripPointSortType, FilterType, UpdateType, UserAction, EventFormViewMode};
