import { render } from '../render';
import TripPointsView from '../view/trip-point-view';
import TripPointsModel from '../model/trip-point-model';
import OffersModel from '../model/offer-model';
import DestinationsModel from '../model/destination-model';
import EventFormView from '../view/event-form-view';
import { randomTripPoint } from '../moks/trip-point-moks';

export default class BoardPresenter {

  #tripPointsContainer = null;
  #tripPointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({tripPointsContainer}) {
    this.#tripPointsContainer = tripPointsContainer;
  }

  init = () => {

    this.#tripPointsModel = new TripPointsModel();
    this.#offersModel = new OffersModel();
    this.#destinationsModel = new DestinationsModel();

    render(new EventFormView(null, this.#offersModel.getOffersByType, this.#destinationsModel.destinations), this.#tripPointsContainer);
    render(new EventFormView(
      this.#tripPointsModel.tripPoints[0],
      this.#offersModel.getOffersByType,
      this.#destinationsModel.destinations
    ), this.#tripPointsContainer);

    for (const tripPoint of this.#tripPointsModel.tripPoints) {
      render(new TripPointsView(
        tripPoint,
        this.#offersModel.getOffersOfType(tripPoint.type),
        this.#destinationsModel.destinations[tripPoint.destination]
      ), this.#tripPointsContainer);
    }
  };

}
