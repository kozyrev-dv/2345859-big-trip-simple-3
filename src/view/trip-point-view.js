import AbstractView from '../framework/abstract-view.js';
import dayjs from 'dayjs';
import { uppercaseFirst } from '../framework/utils/string-utils.js';

const createEventOfferElementTemplate = (offer) =>
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;

const createTripPointTemplate = (basePrice, dateFrom, dateTo, destinationData, id, offersData, type) => {

  const date = dateFrom.substring(0, dateFrom.indexOf('T'));
  const offersItems = offersData.map((offer) => createEventOfferElementTemplate(offer)).join('');
  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${dayjs(dateFrom).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${uppercaseFirst(type)} ${destinationData.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${dayjs(dateFrom).format('H:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${dayjs(dateTo).format('H:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
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

  constructor(basePrice, dateFrom, dateTo, destinationData, id, offersData, type) {
    super(createTripPointTemplate(basePrice, dateFrom, dateTo, destinationData, id, offersData, type));
    this.#basePrice = basePrice;
    this.#dateFrom = dateFrom;
    this.#dateTo = dateTo;
    this.#destination = destinationData;
    this.#id = id;
    this.#offers = offersData;
    this.#type = type;
  }
}
