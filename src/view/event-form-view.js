import AbstractView from '../framework/view/abstract-view';
import { OFFER_TYPES } from '../moks/const';
import { uppercaseFirst } from '../framework/utils/string-utils';
import dayjs from 'dayjs';

const createDestinationPhotostape = (destination) => destination.pictures.map(
  (picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
).join('');

const createDestinationDescriptionElement = (destination) => (destination) ? `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationPhotostape(destination)}
      </div>
    </div>
  </section>
` : '';

const createDestinationOptions = (destinations) => destinations.map((destination) =>
  `<option value="${destination.name}"></option>`
).join('');

const createOfferSelectors = (currentTypeOffers, checkedOffers, id) => {
  const isHidden = (currentTypeOffers.length === 0) ? 'visually-hidden' : '';
  return ` <div class="event__available-offers ${isHidden}"> ${
    currentTypeOffers.map((offer) => {
      const isChecked = checkedOffers.includes(offer.id) ? 'checked' : '';
      return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked}>
          <label class="event__offer-label" for="event-offer-${offer.id}-${id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
    }).join('')
  }
  </div>`;
};


const createTripPointFormViewTemplate = (point, offersByType, destinations) => {
  const actualPoint = point ?? {
    'basePrice' : '',
    'dateFrom' : undefined,
    'dateTo' : undefined,
    'destination': null,
    'id': 0,
    'offers': null,
    'type': OFFER_TYPES[0]
  };
  const currentTypeOffers = offersByType.find((el) => el.type === actualPoint.type).offers;

  const dateFromActual = dayjs(actualPoint.dateFrom).format('DD/MM/YY HH:mm'); //19/03/19 00:00
  const dateToActual = dayjs(actualPoint.dateTo).format('DD/MM/YY HH:mm'); //19/03/19 00:00
  const checkedOffersIds = (actualPoint.offers) ? actualPoint.offers.map((offer) => offer.id) : [];

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${actualPoint.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${uppercaseFirst(actualPoint.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${(actualPoint.destination) ? destinations[actualPoint.destination].name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromActual}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToActual}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${actualPoint.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${createOfferSelectors(currentTypeOffers, checkedOffersIds, actualPoint.id)}
        </section>

        ${createDestinationDescriptionElement(destinations[actualPoint.destination])}

      </section>
    </form>
    </li>`;
};

/**
 * Create form view
 *
 * @class CreateFormView
 * @extends {AbstractView}
 */

export default class EventFormView extends AbstractView{

  #point = null;
  #offersByType = null;
  #destinations = null;

  constructor(point, offersByType, destinations) {
    super();
    this.#point = point;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
  }

  get template() {
    return createTripPointFormViewTemplate(this.#point, this.#offersByType, this.#destinations);
  }

  setOnSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#onSubmitHandler);
  };

  #onSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit();
  };

}
