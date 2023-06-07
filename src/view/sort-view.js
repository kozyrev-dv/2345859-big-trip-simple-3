import AbstractView from '../framework/view/abstract-view';
import { SORT_HEADERS } from '../moks/const';

const createSortItemElement = (sortType) => `
  <div class="trip-sort__item  trip-sort__item--${sortType}">
    <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}">
    <label data-sort-type="${sortType.toUpperCase()}" class="trip-sort__btn" for="sort-${sortType}">${SORT_HEADERS[sortType]}</label>
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

  constructor(sortTypes) {
    super();
    this.#sortTypes = sortTypes;
  }

  get template() {
    return createSortElementTemplate(this.#sortTypes);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

}
