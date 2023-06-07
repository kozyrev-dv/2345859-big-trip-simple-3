import { render } from '../framework/render';
import TripPointsModel from '../model/trip-points-model';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';
import EmptyBoardView from '../view/empty-board-view';
import TripPointPresenter from './trip-point-presenter';
import { FilterType, tripPointSortType, UserAction, UpdateType } from '../moks/const';
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

    BoardPresenter.#tripPointsModel.addObserver(this.#handleModelEvent);

    this.#sortView = new SortView(sortTypes);
    this.#filterView = new FilterView(filters);

    this.#renderFilter();
    this.#renderSort();

    this.#renderPoints();

  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_POINT:
        BoardPresenter.#tripPointsModel.addTripPoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        BoardPresenter.#tripPointsModel.updateTripPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        throw new Error('Can not delete a point yet');
        //BoardPresenter.#tripPointsModel.deleteTripPoint(updateType, update);
        //break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#removePoints();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#removePoints(true);
        this.#renderPoints();
        break;
      default:
        throw new Error('Unknown update type used');
    }
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

  #removePoints = (resetSortType) => {
    for(const pres of this.#tripPointPresenters.values()) {
      pres.removePoint();
    }
    this.#tripPointPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = tripPointSortType.DAY;
    }
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
        this.#tripPointsContainer,
        {
          onDataChange: this.#handleViewAction
        }
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
        }
      });
    }
  };

}
