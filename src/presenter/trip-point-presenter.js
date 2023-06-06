

export default class TripPointPresenter {

  #point = null;
  #offersByType = null;
  #destinations = null;

  constructor(point, offersByType, destinations) {
    this.#point = point;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
  }

  init = () => {
    const tripPointView = new TripPointsView(
      this.#point,
      this.#offers,
      this.#destination
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

  }

}
