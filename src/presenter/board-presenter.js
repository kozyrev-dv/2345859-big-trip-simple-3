import { render } from '../render';
import TripPointView from '../view/trip-point-view';
import EventFormView from '../view/event-form-view';
import { randomTripPoint } from '../moks/trip-point-moks';
import { OFFERS_BY_TYPES } from '../moks/offers-by-type-moks';
import { DESTINATIONS } from '../moks/const';

export default class BoardPresenter {

  #tripPointsContainer = null;

  constructor({tripPointsContainer}) {
    this.#tripPointsContainer = tripPointsContainer;
  }

  init() {

    render(new EventFormView(), this.#tripPointsContainer);

    const tripPointViews = Array.from({length: Math.floor(Math.random() * 30) + 5}, () => {
      const randTripPointModel = randomTripPoint();
      const offersData = OFFERS_BY_TYPES.find((el) => el.type === randTripPointModel.type).offers.filter(
        (offer) => randTripPointModel.offers.includes(offer.id)
      );
      const destinationData = DESTINATIONS[randTripPointModel.destination];

      return new TripPointView(
        randTripPointModel.basePrice,
        randTripPointModel.dateFrom,
        randTripPointModel.dateTo,
        destinationData,
        randTripPointModel.id,
        offersData,
        randTripPointModel.type
      );
    });

    for (const el of tripPointViews){
      render(el, this.#tripPointsContainer);
    }
  }

}
