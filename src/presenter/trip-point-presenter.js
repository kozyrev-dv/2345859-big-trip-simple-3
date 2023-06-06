import BoardPresenter from './board-presenter';
import TripPointsView from '../view/trip-point-view';
import EventFormView from '../view/event-form-view';
import { render, replace } from '../framework/render';

export default class TripPointPresenter {

  #point = null;

  #tripPointsContainer = null;

  #tripPointView = null;
  #eventFormView = null;
  constructor(point, tripPointsContainer) {
    this.#point = point;
    this.#tripPointsContainer = tripPointsContainer;
  }

  init = () => {
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
      replace(this.#eventFormView, this.#tripPointView);
    });

    this.#eventFormView.setOnSubmitHandler(() => {
      replace(this.#tripPointView, this.#eventFormView);
    });

    render(this.#tripPointView, this.#tripPointsContainer);
  };

}
