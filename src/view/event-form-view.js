import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EVENT_TYPES } from '../moks/const';
import { uppercaseFirst } from '../framework/utils/string-utils';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

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

const createEventTypeElementList = (currentEventType, currentPointId, eventTypes = EVENT_TYPES) => eventTypes.map((eventType) => `
  <div class="event__type-item">
    <input id="event-type-${eventType}-${currentPointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${(eventType === currentEventType) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${currentPointId}">${uppercaseFirst(eventType)}</label>
  </div>`).join('');

const createTripPointFormViewTemplate = (pointState, offersByType, destinations) => {

  const currentTypeOffers = offersByType.find((el) => el.type === pointState.type).offers;

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointState.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeElementList(pointState.type, pointState.id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${uppercaseFirst(pointState.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${(pointState.destination) ? destinations[pointState.destination].name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${pointState.dateFromFormated}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${pointState.dateToFormated}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${pointState.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${createOfferSelectors(currentTypeOffers, pointState.checkedOffersIds, pointState.id)}
        </section>

        ${createDestinationDescriptionElement(destinations[pointState.destination])}

      </section>
    </form>
    </li>`;
};

/**
 * Create form view
 *
 * @class CreateFormView
 * @extends {AbstractStatefulView}
 */

export default class EventFormView extends AbstractStatefulView{

  #offersByType = null;
  #destinations = null;

  constructor(point, offersByType, destinations) {
    super();
    this._setState(EventFormView.parsePointToState(point));
    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this._restoreHandlers();

  }

  static parsePointToState = (point) => {
    const actualPoint = point ?? {
      'basePrice' : '',
      'dateFrom' : undefined,
      'dateTo' : undefined,
      'destination': null,
      'id': nanoid(),
      'offers': null,
      'type': EVENT_TYPES[0]
    };
    const dateFromActual = dayjs(actualPoint.dateFrom).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    const dateToActual = dayjs(actualPoint.dateTo).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    const checkedOffersIds = (actualPoint.offers) ? actualPoint.offers.map((offer) => offer.id) : [];

    return {
      ...actualPoint,
      dateFromFormated: dateFromActual,
      dateToFormated: dateToActual,
      checkedOffersIds: checkedOffersIds,
    };
  };

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.dateFromFormated;
    delete point.dateToFormated;
    delete point.checkedOffersIds;

    return point;
  };

  get template() {
    return createTripPointFormViewTemplate(this._state, this.#offersByType, this.#destinations);
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClicked);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#onDestinationChanged);
  };

  #onEventTypeClicked = (evt) => {
    evt.preventDefault();
    const type = evt.target.parentNode.querySelector('.event__type-input').value;
    if (this._state.type === type) {
      return;
    }

    this.updateElement({type: type});
  };

  #onDestinationChanged = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    const newDest = this.#destinations.find((el) => el.name === destination);
    if (newDest !== undefined){
      this.updateElement({destination: newDest.id});
    }
  };

  setOnSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#onSubmitHandler);
  };

  #onSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(EventFormView.parseStateToPoint(this._state));
  };

}
