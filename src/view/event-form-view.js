import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { EVENT_TYPES, EventFormViewMode, UpdateType, UserAction } from '../moks/const';
import { uppercaseFirst } from '../framework/utils/string-utils';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import { remove } from '../framework/render';

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

const createOfferSelector = (isChecked, offer, eventId, isDisabled) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" data-raw-id=${offer.id} id="event-offer-${offer.id}-${eventId}" type="checkbox" name="event-offer-${offer.id}" ${isChecked} ${isDisabled}>
    <label class="event__offer-label" for="event-offer-${offer.id}-${eventId}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;

const createOfferSelectors = (currentTypeOffers, checkedOffers, eventId, isDisabled) => {
  if (currentTypeOffers.length === 0) {
    return '';
  }
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
  ${currentTypeOffers.map((offer) => {
    const isChecked = checkedOffers.includes(offer.id) ? 'checked' : '';
    return createOfferSelector(isChecked, offer, eventId, isDisabled);
  }).join('')}
      </div>
    </section>`;
};

const createEventTypeElementList = (currentEventType, currentPointId, eventTypes = EVENT_TYPES) => eventTypes.map((eventType) => `
  <div class="event__type-item">
    <input id="event-type-${eventType}-${currentPointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${(eventType === currentEventType) ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${currentPointId}">${uppercaseFirst(eventType)}</label>
  </div>`).join('');

const createFormCreateTemplate = (pointState, offersByType, destinations) => {
  const currentTypeOffers = offersByType.find((el) => el.type === pointState.type).offers;
  const destination = destinations.find((dest) => dest.id === pointState.destination);
  const isDisabledTag = pointState.isDisabled ? 'disabled' : '';
  const saveText = pointState.isSaving ? 'Saving...' : 'Save';
  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointState.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointState.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointState.id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeElementList(pointState.type, pointState.id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointState.id}">
            ${uppercaseFirst(pointState.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${pointState.id}" type="text" name="event-destination" value="${(pointState.destination) ? destination.name : ''}" list="destination-list-${pointState.id}" ${isDisabledTag}>
          <datalist id="destination-list-${pointState.id}">
            ${createDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointState.id}">From</label>
          <input class="event__input  event__input--time event__input--time-start" id="event-start-time-${pointState.id}" type="text" name="event-start-time" value="${pointState.dateFromFormated}" ${isDisabledTag}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointState.id}">To</label>
          <input class="event__input  event__input--time event__input--time-end" id="event-end-time-${pointState.id}" type="text" name="event-end-time" value="${pointState.dateToFormated}" ${isDisabledTag}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointState.id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointState.id}" type="text" name="event-price" value="${pointState.basePrice}" ${isDisabledTag}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabledTag}>${saveText}</button>
        <button class="event__reset-btn" type="reset" ${isDisabledTag}>Cancel</button>
      </header>
      <section class="event__details">
        ${createOfferSelectors(currentTypeOffers, pointState.offers, pointState.id, pointState.isDisabled)}
        ${createDestinationDescriptionElement(destination)}
      </section>
    </form>
    </li>`;
};

const createFormEditTemplate = (pointState, offersByType, destinations) => {
  const currentTypeOffers = offersByType.find((el) => el.type === pointState.type).offers;
  const destination = destinations.find((dest) => dest.id === pointState.destination);
  const isDisabledTag = pointState.isDisabled ? 'disabled' : '';
  const saveText = pointState.isSaving ? 'Saving...' : 'Save';
  const deleteText = pointState.isDeleting ? 'Deleting...' : 'Delete';
  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointState.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointState.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointState.id}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeElementList(pointState.type, pointState.id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointState.id}">
            ${uppercaseFirst(pointState.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${pointState.id}" type="text" name="event-destination" value="${(pointState.destination) ? destination.name : ''}" list="destination-list-${pointState.id}" ${isDisabledTag}>
          <datalist id="destination-list-${pointState.id}">
            ${createDestinationOptions(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointState.id}">From</label>
          <input class="event__input event__input--time event__input--time-start" id="event-start-time-${pointState.id}" type="text" name="event-start-time" value="${pointState.dateFromFormated}" ${isDisabledTag}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointState.id}">To</label>
          <input class="event__input event__input--time event__input--time-end" id="event-end-time-${pointState.id}" type="text" name="event-end-time" value="${pointState.dateToFormated}" ${isDisabledTag}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointState.id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointState.id}" type="text" name="event-price" value="${pointState.basePrice}" ${isDisabledTag}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabledTag}>${saveText}</button>
        <button class="event__reset-btn" type="reset" ${isDisabledTag}>${deleteText}</button>
        <button class="event__rollup-btn" type="button" ${isDisabledTag}>
                    <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOfferSelectors(currentTypeOffers, pointState.offers, pointState.id, pointState.isDisabled)}
        ${createDestinationDescriptionElement(destination)}
      </section>
    </form>
  </li>`;
};

const createTripPointFormViewTemplate = (mode, pointState, offersByType, destinations) => {

  switch (mode) {
    case EventFormViewMode.EDIT: return createFormEditTemplate(pointState, offersByType, destinations);
    case EventFormViewMode.CREATE: return createFormCreateTemplate(pointState, offersByType, destinations);
  }
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

  #dateFromDatepicker = null;
  #dateToDatepicker = null;

  #isDisabledSave = true;
  #isValidDestinationInput = false;
  #mode = null;

  constructor(mode, point, offersByType, destinations) {
    super();
    this._setState(EventFormView.parsePointToState(point));
    this.#offersByType = offersByType;
    this.#destinations = destinations;

    this.#mode = mode;
    if (Number(this._state.destination)){
      this.#isValidDestinationInput = destinations.some((dest) => dest.id === point.destination);
    }
    this._restoreHandlers();
  }

  static parsePointToState = (point) => {
    const actualPoint = point ?? {
      'basePrice' : '',
      'dateFrom' : dayjs().toString(),
      'dateTo' : dayjs().add(1, 'day').toString(),
      'destination': null,
      'offers': [],
      'type': EVENT_TYPES[0]
    };
    const dateFromFormated = dayjs(actualPoint.dateFrom).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    const dateToFormated = dayjs(actualPoint.dateTo).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    const checkedOffersIds = actualPoint.offers ?? [];
    return {
      ...actualPoint,
      dateFromFormated: dateFromFormated,
      dateToFormated: dateToFormated,
      offers: checkedOffersIds,
      isSaving: false,
      isDeleting: false,
      isDisabled: false
    };
  };

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.dateFromFormated;
    delete point.dateToFormated;
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;

    return point;
  };

  get template() {
    return createTripPointFormViewTemplate(this.#mode, this._state, this.#offersByType, this.#destinations);
  }

  get isDisabledSave() {
    return this.#isDisabledSave;
  }

  set isDisabledSave(value) {
    this.#isDisabledSave = value;
    this.element.querySelector('.event__save-btn').disabled = this.#isDisabledSave;
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromDatepicker) {
      this.#dateFromDatepicker.destroy();
      this.#dateFromDatepicker = null;
    }

    if (this.#dateToDatepicker) {
      this.#dateToDatepicker.destroy();
      this.#dateToDatepicker = null;
    }
  }

  #setDatePickers = () => {
    this.#dateFromDatepicker = flatpickr(
      this.element.querySelector('.event__input--time-start'),
      {
        dateFormat: 'd/m/y H:i', //19/03/19 00:00
        enableTime: true,
        defaultDate: dayjs(this._state.dateFrom).toDate(),
        onClose: this.#onDateFromPickerClosed
      }
    );
    this.#dateToDatepicker = flatpickr(
      this.element.querySelector('.event__input--time-end'),
      {
        dateFormat: 'd/m/y H:i', //19/03/19 00:00
        enableTime: true,
        defaultDate: dayjs(this._state.dateTo).toDate(),
        onClose: this.#onDateToPickerClosed
      }
    );
  };

  #validateInputs() {
    this.isDisabledSave = this._state.isDisabled || !(this._state.destination && this.#isValidDestinationInput &&
      dayjs(this._state.dateFrom).isValid() &&
      dayjs(this._state.dateTo).isValid() &&
      Number(this.element.querySelector('.event__input--price').value));
  }

  _restoreHandlers = () => {
    this.#setDatePickers();

    this.setOnFormSubmit(this._callback.submit);
    if (this.#mode === EventFormViewMode.EDIT) {
      this.setOnFormDeleteClick(this._callback.delete);
    }
    this.setOnFormCancel(this._callback.cancel);

    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClicked);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#onDestinationChanged);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#onOffersCheckedChange);

    this.#validateInputs();
  };

  #onOffersCheckedChange = (evt) => {
    const offerId = parseInt(evt.target.dataset.rawId, 10);
    if (evt.target.checked) {
      this._state.offers.push(offerId);
    } else {
      this._state.offers = this._state.offers.filter((el) => el !== offerId);
    }
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();
    this.#validateInputs();
    this._setState({
      basePrice: this.element.querySelector('.event__input--price').value
    });
  };

  #onDateFromPickerClosed = ([dateFrom]) => {
    const dateFromFormated = dayjs(dateFrom).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    this.updateElement({
      dateFrom: dateFrom.toString(),
      dateFromFormated: dateFromFormated
    });
  };

  #onDateToPickerClosed = ([dateTo]) => {
    const dateToFormated = dayjs(dateTo).format('DD/MM/YY HH:mm'); //19/03/19 00:00
    this.updateElement({
      dateTo: dateTo.toString(),
      dateToFormated: dateToFormated
    });
  };

  #onEventTypeClicked = (evt) => {
    evt.preventDefault();
    const type = evt.target.parentNode.querySelector('.event__type-input').value;
    if (this._state.type === type) {
      return;
    }

    this.updateElement({
      type: type,
      offers: []
    });
  };

  #onDestinationChanged = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    const newDest = this.#destinations.find((el) => el.name === destination);
    if (newDest !== undefined){
      this.updateElement({
        destination: newDest.id,
      });
      this.#isValidDestinationInput = true;
    } else {
      this.#isValidDestinationInput = false;
    }

    this.#validateInputs();
  };

  setOnFormSubmit = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#onFormSubmit);
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    if (this.#mode === EventFormViewMode.CREATE) {
      this._callback.submit(UserAction.ADD_POINT, UpdateType.MINOR, EventFormView.parseStateToPoint(this._state, this.#offersByType));
      return;
    }
    this._callback.submit(EventFormView.parseStateToPoint(this._state, this.#offersByType));
  };

  setOnFormDeleteClick = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormDeleteClick);
  };

  #onFormDeleteClick = (evt) => {
    evt.preventDefault();
    this._callback.delete();
  };

  setOnFormCancel = (callback) => {
    this._callback.cancel = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onFormCancel);
    if (this.#mode === EventFormViewMode.CREATE) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormCancel);
    }
  };

  #onFormCancel = (evt) => {
    evt.preventDefault();
    this._callback.cancel();
  };

  setSaving = () => {
    this.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setDeleting = () => {
    this.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  };

  setAborting = () => {
    this.shake(() =>
      this.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false
      })
    );
  };

  reset = (point) => {
    this.updateElement(
      EventFormView.parsePointToState(point)
    );
  };

  cancel = () => {
    remove(this);
  };

}
