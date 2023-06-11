import AbstractView from '../framework/view/abstract-view';

const SORT_HEADERS = {
  'day': 'Day',
  'event': 'Event',
  'time': 'Time',
  'price': 'Price',
  'offer': 'Offers'
};

const SORT_TYPES = ['day', 'event', 'time', 'price', 'offer'];

const createSortItemElement = (sortType) => `
  <div class="trip-sort__item  trip-sort__item--${sortType}">
    <input data-sort-type="${sortType.toUpperCase()}" id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${sortType === 'day' ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${sortType}">${SORT_HEADERS[sortType]}</label>
  </div>`;

const createSortElementTemplate = (sortTypes) => {
  const sortItems = sortTypes.map((type) => createSortItemElement(type)).join('');
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItems}
  </form>`;
};

/**
 * Sort element view
 *
 * @class SortView
 * @extends {AbstractView}
 */

export default class SortView extends AbstractView{

  #sortTypes = null;

  constructor() {
    super();
    this.#sortTypes = SORT_TYPES;
  }

  get template() {
    return createSortElementTemplate(this.#sortTypes);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  };

  changeSort(sortType) {
    this.element.querySelector(`#sort-${sortType.toLowerCase()}`).checked = true;
    this._callback.sortTypeChange(sortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  block = () => {
    this.element.querySelectorAll('.trip-sort__input').forEach((el) => {el.disabled = true;});
  };

  unblock = () => {
    this.element.querySelectorAll('.trip-sort__input').forEach((el) => {el.disabled = true;});
  };

}
