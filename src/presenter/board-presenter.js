import { render } from '../framework/render';
import TripPointsModel from '../model/trip-point-model';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';
import EmptyBoardView from '../view/empty-board-view';
import TripPointPresenter from './trip-point-presenter';
import { FilterType, SortType } from '../moks/const';
import dayjs from 'dayjs';

export default class BoardPresenter {

  #tripPointsContainer = null;

  #tripPointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripPointFormMap = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  constructor({tripPointsContainer}) {
    this.#tripPointsContainer = tripPointsContainer;
  }

  static #sortPointsByDay = (a ,b) => {
    const diff = dayjs(a.dateFrom).diff(dayjs(b.dateFrom));
    if (diff > 0) {
      return 1;
    }
    if (diff < 0){
      return -1;
    }

    return 0;
  };

  static #sortPointsByPrice(a, b) {
    if (a.price > b.price) {
      return 1;
    }
    if (a.price < b.price) {
      return 0;
    }

    return 0;
  }

  #filterTripPoints = (point) => {
    if (this.#currentFilterType === FilterType.FUTURE) {
      return dayjs().isBefore(dayjs(point.dateTo), 'date');
    }
    return true;
  };

  get tripPoints() {
    switch(this.#currentSortType) {
      case SortType.DAY:
        return [...this.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByDay);
      case SortType.PRICE:
        return [...this.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByPrice);
    }
    return this.#tripPointsModel.tripPoints;
  }

  init = () => {

    this.#tripPointsModel = new TripPointsModel();
    this.#offersModel = new OffersModel();
    this.#destinationsModel = new DestinationsModel();

    this.#tripPointFormMap = new Map();

    if(this.tripPoints.length === 0) {
      render(new EmptyBoardView(), this.#tripPointsContainer);
      return;
    }

    for (const tripPoint of this.tripPoints) {

      const tripPointPresenter = new TripPointPresenter(
        tripPoint,
        this.#offersModel.offersByType,
        this.#destinationsModel.destinations
      );
      tripPointPresenter.init();
      render(tripPointView, this.#tripPointsContainer);
    }
  };

}
