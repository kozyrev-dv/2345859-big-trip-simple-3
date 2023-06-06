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

  static #tripPointsModel = null;
  static #offersModel = null;
  static #destinationsModel = null;

  #currentSortType = SortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  #tripPointPresenters = new Map();

  static get offersModel() {
    return this.#offersModel;
  }

  static get destinationsModel() {
    return this.#destinationsModel;
  }

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
        return [...BoardPresenter.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByDay);
      case SortType.PRICE:
        return [...BoardPresenter.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByPrice);
    }
    return BoardPresenter.#tripPointsModel.tripPoints;
  }

  init = () => {

    BoardPresenter.#tripPointsModel = new TripPointsModel();
    BoardPresenter.#offersModel = new OffersModel();
    BoardPresenter.#destinationsModel = new DestinationsModel();

    this.renderPoints();

  };

  renderPoints = () => {
    if(this.tripPoints.length === 0) {
      render(new EmptyBoardView(), this.#tripPointsContainer);
      return;
    }

    for (const tripPoint of this.tripPoints) {
      const tripPointPresenter = new TripPointPresenter(
        tripPoint,
        this.#tripPointsContainer
      );

      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);

      tripPointPresenter.init({
        onTripPointClick: () => {
          tripPointPresenter.switchToForm();
          for (const pres of this.#tripPointPresenters.values()) {
            if(pres !== tripPointPresenter) {
              pres.switchToItem();
            }
          }
        },
        onEventFormViewSubmit: () => {
          tripPointPresenter.switchToItem();
        }
      });
    }
  };

}
