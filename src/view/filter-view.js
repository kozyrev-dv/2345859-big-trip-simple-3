import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../moks/const';

const FILTER_HEADERS = {
  'future': 'Future',
  'everything': 'Everything'
};

const FILTERS = ['future', 'everything'];

const createFilterItemElement = (filter) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
    <label class="trip-filters__filter-label" for="filter-${filter}">${FILTER_HEADERS[filter]}</label>
  </div>`;

const createFilterTemplate = (filters) => {
  const filterItems = filters.map((filter) => createFilterItemElement(filter)).join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItems}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

/**
 * Filter view
 *
 * @class FilterView
 * @extends {AbstractView}
 */

export default class FilterView extends AbstractView{

  #filters = null;
  #onFilterClick = null;

  constructor({onFilterClick}) {
    super();
    this.#filters = FILTERS;
    this.#onFilterClick = onFilterClick;
    this.element.querySelectorAll('.trip-filters__filter-input').forEach((el) => el.addEventListener('change', this.#onFilterItemClick));
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #onFilterItemClick = (evt) => {
    evt.preventDefault();
    let filterType = null;
    switch (evt.target.value) {
      case 'future':
        filterType = FilterType.FUTURE;
        break;
      case 'everything':
        filterType = FilterType.EVERYTHING;
        break;
      default:
        throw new Error('Unknown FilterType');
    }
    this.#onFilterClick(filterType);
  };

}
