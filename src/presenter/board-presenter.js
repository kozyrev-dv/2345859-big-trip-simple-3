import { render } from '../framework/render';
import TripPointsModel from '../model/trip-point-model';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';
import EmptyBoardView from '../view/empty-board-view';
import TripPointPresenter from './trip-point-presenter';
import { FilterType, tripPointSortType } from '../moks/const';
import dayjs from 'dayjs';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';

const filters = ['future', 'everything'];
const sortTypes = ['day', 'event', 'time', 'price', 'offer'];

export default class BoardPresenter {

  #tripPointsContainer = null;

  static #tripPointsModel = null;
  static #offersModel = null;
  static #destinationsModel = null;

  #sortView = null;
  #filterView = null;

  #currentSortType = tripPointSortType.DAY;
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
    if (a.basePrice > b.basePrice) {
      return -1;
    }
    if (a.basePrice < b.basePrice) {
      return 1;
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
      case tripPointSortType.DAY:
        return [...BoardPresenter.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByDay);
      case tripPointSortType.PRICE:
        return [...BoardPresenter.#tripPointsModel.tripPoints].filter(this.#filterTripPoints).sort(BoardPresenter.#sortPointsByPrice);
    }
    return BoardPresenter.#tripPointsModel.tripPoints;
  }

  init = () => {

    BoardPresenter.#tripPointsModel = new TripPointsModel();
    BoardPresenter.#offersModel = new OffersModel();
    BoardPresenter.#destinationsModel = new DestinationsModel();
    this.#sortView = new SortView(sortTypes);
    this.#filterView = new FilterView(filters);

    this.#renderFilter();
    this.#renderSort();

    this.#renderPoints();

  };

  #renderSort = () => {
    render(this.#sortView, document.querySelector('.trip-events__sort'));
    this.#sortView.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #onSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType || !Object.values(tripPointSortType).includes(sortType)) {
      return;
    }
    this.#currentSortType = sortType;
    this.#removePoints();
    this.#renderPoints();
  };

  #renderFilter = () => {
    render(this.#filterView, document.querySelector('.trip-controls__filters'));
  };

  #removePoints = () => {
    for(const pres of this.#tripPointPresenters.values()) {
      pres.removePoint();
    }
    this.#tripPointPresenters.clear();
  };

  #renderPoints = () => {
    const tripPoints = this.tripPoints;
    if(tripPoints.length === 0) {
      render(new EmptyBoardView(), this.#tripPointsContainer);
      return;
    }

    for (const tripPoint of tripPoints) {
      const tripPointPresenter = new TripPointPresenter(
        tripPoint,
        this.#tripPointsContainer
      );

      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);

      tripPointPresenter.init({
        onTripPointClick: () => {
          tripPointPresenter.switchViewToForm();
          for (const pres of this.#tripPointPresenters.values()) {
            if(pres !== tripPointPresenter) {
              pres.switchViewToItem();
            }
          }
        },
        onEventFormViewSubmit: () => {
          tripPointPresenter.switchViewToItem();
        }
      });
    }
  };

}
