import BoardPresenter from './board-presenter';
import TripPointsView from '../view/trip-point-view';
import EventFormView from '../view/event-form-view';
import { remove, render, replace } from '../framework/render';
import { UserAction, UpdateType } from '../moks/const';

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

  constructor(point, tripPointsContainer, {onDataChange}) {
    this.#point = point;
    this.#tripPointsContainer = tripPointsContainer;
    this.#onDataChange = onDataChange;
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

  init = ({onTripPointClick}) => {
    this.#tripPointView = new TripPointsView(
      this.#point,
      BoardPresenter.offersModel.getOffersOfType(this.#point.type),
      BoardPresenter.destinationsModel.destinations[this.#point.destination]
    );
    this.#eventFormView = new EventFormView(
      this.#point,
      BoardPresenter.offersModel.offersByType,
      BoardPresenter.destinationsModel.destinations
    );

    this.#tripPointView.setOnClickHandler(() => {
      onTripPointClick();
    });

    this.#eventFormView.setOnFormSubmit((update) => {
      this.#onDataChange(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        update,
      );
      this.switchViewToItem();
    });

    render(this.#tripPointView, this.#tripPointsContainer);
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
  }

  #onKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventFormView.reset(this.#point);
      this.switchViewToItem();
      document.body.removeEventListener('keydown', this.#onKeyDown);
    }
  };

}
