import { render, replace } from '../framework/render';
import TripPointsView from '../view/trip-point-view';
import TripPointsModel from '../model/trip-point-model';
import OffersModel from '../model/offer-model';
import DestinationsModel from '../model/destination-model';
import EventFormView from '../view/event-form-view';
import EmptyBoardView from '../view/empty-board-view';

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

    if(this.#tripPointsModel.tripPoints.length === 0) {
      render(new EmptyBoardView(), this.#tripPointsContainer);
      return;
    }

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

      tripPointView.setOnClickHandler(() => {
        replace(this.#tripPointFormMap.get(tripPoint).form, this.#tripPointFormMap.get(tripPoint).point);
      });

      eventFormView.setOnSubmitHandler(() => {
        replace(this.#tripPointFormMap.get(tripPoint).point, this.#tripPointFormMap.get(tripPoint).form);
      });

      render(tripPointView, this.#tripPointsContainer);
    }
  };

}
