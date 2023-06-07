import BoardPresenter from './board-presenter';
import TripPointsView from '../view/trip-point-view';
import EventFormView from '../view/event-form-view';
import { remove, render, replace } from '../framework/render';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


const TripPointViewMode = {
  ITEM: 'ITEM',
  FORM: 'FORM'
};

export default class TripPointPresenter {

  #point = null;

  #tripPointsContainer = null;

  #mode = TripPointViewMode.ITEM;

  #tripPointView = null;
  #eventFormView = null;
  constructor(point, tripPointsContainer) {
    this.#point = point;
    this.#tripPointsContainer = tripPointsContainer;
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

  init = ({onTripPointClick, onEventFormViewSubmit}) => {
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

    this.#eventFormView.setOnSubmitHandler(() => {
      onEventFormViewSubmit();
    });

    render(this.#tripPointView, this.#tripPointsContainer);
  };

  switchViewToForm() {
    if(this.mode === TripPointViewMode.ITEM){
      replace(this.eventFormView, this.tripPointView);
      this.#mode = TripPointViewMode.FORM;
    }
  }

  switchViewToItem() {
    if(this.mode === TripPointViewMode.FORM){
      replace(this.tripPointView, this.eventFormView);
      this.#mode = TripPointViewMode.ITEM;
    }
  }

  removePoint() {
    remove(this.#tripPointView);
    remove(this.#eventFormView);
  }

}
