import BoardPresenter from './board-presenter';
import TripPointsView from '../view/trip-point-view';
import EventFormView from '../view/event-form-view';
import { remove, render, replace } from '../framework/render';
import { UserAction, UpdateType, EventFormViewMode } from '../framework/utils/const';

import 'flatpickr/dist/flatpickr.min.css';


const TripPointViewMode = {
  ITEM: 'ITEM',
  FORM: 'FORM'
};

export default class TripPointPresenter {

  #point = null;
  #mode = TripPointViewMode.ITEM;

  #tripPointsContainer = null;

  #tripPointView = null;
  #eventFormView = null;

  #onDataChange = null;
  #onTripPointClick = null;

  constructor(tripPointsContainer, {onDataChange, onTripPointClick}) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#onDataChange = onDataChange;
    this.#onTripPointClick = onTripPointClick;
  }

  get mode() {
    return this.#mode;
  }

  get tripPointView() {
    return this.#tripPointView;
  }

  get eventFormView() {
    return this.#eventFormView;
  }

  init = (point) => {

    const prevPointView = this.tripPointView;
    const prevEventForm = this.eventFormView;
    this.#point = point;

    this.#tripPointView = new TripPointsView(
      this.#point,
      BoardPresenter.offersModel.getOffersOfType(this.#point.type),
      BoardPresenter.destinationsModel.destinations.find((dest) => dest.id === this.#point.destination)
    );
    this.#eventFormView = new EventFormView(
      EventFormViewMode.EDIT,
      this.#point,
      BoardPresenter.offersModel.offersByType,
      BoardPresenter.destinationsModel.destinations
    );

    this.#tripPointView.setOnClickHandler(this.#onTripPointClick);

    this.#eventFormView.setOnFormSubmit((update) => {
      this.#onDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        update,
      );
    });

    this.#eventFormView.setOnFormDeleteClick(() => {
      this.#onDataChange(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        this.#point
      );
    });

    this.#eventFormView.setOnFormCancel(() => {
      this.#cancelFormChanges();
    });

    if (!prevPointView || !prevEventForm) {
      render(this.#tripPointView, this.#tripPointsContainer);
      return;
    }

    if (this.mode === TripPointViewMode.ITEM) {
      replace(this.#tripPointView, prevPointView);
    } else if (this.mode === TripPointViewMode.FORM) {
      replace(this.#eventFormView, prevEventForm);
    }

  };

  switchViewToForm() {
    if(this.mode === TripPointViewMode.ITEM){
      replace(this.eventFormView, this.tripPointView);
      this.#mode = TripPointViewMode.FORM;
      document.body.addEventListener('keydown', this.#onKeyDown);
    }
  }

  switchViewToItem() {
    if(this.mode === TripPointViewMode.FORM){
      document.body.removeEventListener('keydown', this.#onKeyDown);
      replace(this.tripPointView, this.eventFormView);
      this.#mode = TripPointViewMode.ITEM;
    }
  }

  removePoint() {
    remove(this.#tripPointView);
    remove(this.#eventFormView);
    this.#tripPointView = null;
    this.#eventFormView = null;
  }

  setSaving = () => {
    if(this.mode === TripPointViewMode.FORM) {
      this.#eventFormView.setSaving();
    }
  };

  setDeleting = () => {
    if(this.mode === TripPointViewMode.FORM) {
      this.#eventFormView.setDeleting();
    }
  };

  setAborting = () => {
    if(this.mode === TripPointViewMode.ITEM) {
      this.#tripPointView.shake();
      return;
    }

    this.#eventFormView.setAborting();

  };

  #cancelFormChanges = () => {
    this.#eventFormView.reset(this.#point);
    this.switchViewToItem();
    document.body.removeEventListener('keydown', this.#onKeyDown);
  };

  #onKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#cancelFormChanges();
    }
  };
}
