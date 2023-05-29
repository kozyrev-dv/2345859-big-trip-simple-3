import AbstractView from '../framework/abstract-view.js';
import dayjs from 'dayjs';
import { allOffers } from '../moks/const.js';

const createEventOfferElementTemplate = (offerId) =>
  `<li class="event__offer">
    <span class="event__offer-title">${allOffers[offerId].id}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${allOffers[offerId].price}</span>
  </li>`;

const createTripPointTemplate = (tripPoint) => {

  const date = tripPoint['date_from'].substring(0, tripPoint['date_from'].indexOf('T'));
  const offersItems = tripPoint['offers'].map((offer) => createEventOfferElementTemplate(offer)).join('');
  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${dayjs(tripPoint['date_from']).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${tripPoint['type']}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">Flight Chamonix</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${tripPoint['date_from']}">${dayjs(tripPoint['date_from']).format('H:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${tripPoint['date_to']}">${dayjs(tripPoint['date_to']).format('H:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${tripPoint['base_price']}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offersItems}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
</li>`;
};

/**
 * Trip point view
 *
 * @class TripPointView
 * @extends {AbstractView}
 */

export default class TripPointView extends AbstractView{

  #basePrice = null;
  #dateFrom = null;
  #dateTo = null;
  #destination = null;
  #id = null;
  #offers = null;
  #type = null;

  constructor(tripPoint) {
    super(createTripPointTemplate(tripPoint));
    this.#basePrice = tripPoint['base_price'];
    this.#dateFrom = tripPoint['date_from'];
    this.#dateTo = tripPoint['date_to'];
    this.#destination = tripPoint['destination'];
    this.#id = tripPoint['id'];
    this.#offers = tripPoint['offers'];
    this.#type = tripPoint['type'];
  }

}
