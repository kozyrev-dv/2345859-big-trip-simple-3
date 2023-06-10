import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';
import { uppercaseFirst } from '../framework/utils/string-utils.js';

const createEventOfferElementTemplate = (offer) =>
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;

const noOfferSpanElement = () => `<li class="event__offer">
<span class="event__offer-title">No additional offers</span>
</li>`;

const createTripPointTemplate = (point, offersOfType, destination) => {
  const date = point.dateFrom.substring(0, point.dateFrom.indexOf('T'));
  const offersItems = (point.offers.length === 0) ? noOfferSpanElement() : point.offers.map((offerId) => createEventOfferElementTemplate(
    offersOfType.find((el) => el.id === offerId)
  )).join('');

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${dayjs(point.dateFrom).format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${uppercaseFirst(point.type)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateFrom}">${dayjs(point.dateFrom).format('H:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.dateTo}">${dayjs(point.dateTo).format('H:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
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

  #point = null;
  #offersOfType = null;
  #destination = null;

  constructor(point, offersOfType, destination) {
    super();
    this.#point = point;
    this.#offersOfType = offersOfType;
    this.#destination = destination;
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#offersOfType, this.#destination);
  }

  setOnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClickHandler);
  };

  #onClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

}
