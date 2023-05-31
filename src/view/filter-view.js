import AbstractView from '../framework/abstract-view.js';
import { FILTER_HEADERS } from '../moks/const.js';

const createFilterItemElement = (filter) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
    <label class="trip-filters__filter-label" for="filter-future">${FILTER_HEADERS[filter]}</label>
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

  constructor(filters) {
    super(createFilterTemplate(filters));
  }

}
