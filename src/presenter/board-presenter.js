import { render } from '../render';
import TripPointsView from '../view/trip-point-view';
import TripPointsModel from '../model/trip-point-model';
import OffersModel from '../model/offer-model';
import DestinationsModel from '../model/destination-model';
import EventFormView from '../view/event-form-view';

export default class BoardPresenter {

  #tripPointsContainer = null;

  #tripPointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripPointFormMap = null;

  constructor({tripPointsContainer}) {
    this.#tripPointsContainer = tripPointsContainer;
  }

  init = () => {

    this.#tripPointsModel = new TripPointsModel();
    this.#offersModel = new OffersModel();
    this.#destinationsModel = new DestinationsModel();

    this.#tripPointFormMap = new Map();

    // render(new EventFormView(null, this.#offersModel.getOffersByType, this.#destinationsModel.destinations), this.#tripPointsContainer);
    // render(new EventFormView(
    //   this.#tripPointsModel.tripPoints[0],
    //   this.#offersModel.getOffersByType,
    //   this.#destinationsModel.destinations
    // ), this.#tripPointsContainer);

    for (const tripPoint of this.#tripPointsModel.tripPoints) {

      const tripPointView = new TripPointsView(
        tripPoint,
        this.#offersModel.getOffersOfType(tripPoint.type),
        this.#destinationsModel.destinations[tripPoint.destination]
      );
      const eventFormView = new EventFormView(
        tripPoint,
        this.#offersModel.offersByType,
        this.#destinationsModel.destinations
      );
      this.#tripPointFormMap.set(tripPoint, {
        'point' : tripPointView,
        'form' : eventFormView
      });

      tripPointView.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
        evt.preventDefault();
        this.#tripPointsContainer.replaceChild(
          this.#tripPointFormMap.get(tripPoint).form.element,
          this.#tripPointFormMap.get(tripPoint).point.element
        );
      });

      eventFormView.element.addEventListener('submit', (evt) => {
        evt.preventDefault();
        this.#tripPointsContainer.replaceChild(
          this.#tripPointFormMap.get(tripPoint).point.element,
          this.#tripPointFormMap.get(tripPoint).form.element
        );
      });

      render(tripPointView, this.#tripPointsContainer);
    }
  };

}
