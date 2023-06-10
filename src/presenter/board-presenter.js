import { render, remove } from '../framework/render';
import EmptyBoardView from '../view/empty-board-view';
import TripPointPresenter from './trip-point-presenter';
import { FilterType, tripPointSortType, UserAction, UpdateType, EventFormViewMode } from '../moks/const';
import dayjs from 'dayjs';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventFormView from '../view/event-form-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class BoardPresenter {

  #tripPointsContainer = null;

  static #tripPointsModel = null;
  static #offersModel = null;
  static #destinationsModel = null;

  #sortView = null;
  #filterView = null;
  #createEventForm = null;

  #currentSortType = tripPointSortType.DAY;
  #currentFilterType = FilterType.EVERYTHING;

  #tripPointPresenters = new Map();
  #initCounter = 0;
  #isLoading = false;
  #uiBlocker = new UiBlocker(350, 1500);

  static get offersModel() {
    return this.#offersModel;
  }

  static get destinationsModel() {
    return this.#destinationsModel;
  }

  constructor({tripPointsModel, offersModel, destinationsModel, tripPointsContainer}) {
    this.#tripPointsContainer = tripPointsContainer;

    BoardPresenter.#tripPointsModel = tripPointsModel;
    BoardPresenter.#destinationsModel = destinationsModel;
    BoardPresenter.#offersModel = offersModel;

    BoardPresenter.#tripPointsModel.addObserver(this.#handleModelEvent);
    BoardPresenter.#offersModel.addObserver(this.#handleModelEvent);
    BoardPresenter.#destinationsModel.addObserver(this.#handleModelEvent);

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

  get isLoading() {
    return this.#isLoading;
  }

  set isLoading(value) {
    const prevValue = this.#isLoading;
    this.#isLoading = value;
    if(!prevValue && this.isLoading) {
      this.#uiBlocker.block();
    } else if (!this.isLoading) {
      this.#uiBlocker.unblock();
    }
  }

  init = () => {

    this.isLoading = true;
    this.#filterView = new FilterView({
      onFilterClick: this.#onFilterClick
    });
    this.#sortView = new SortView();

    this.#renderFilter();
    this.#renderSort();

    Promise.all([
      BoardPresenter.#tripPointsModel.init(),
      BoardPresenter.#offersModel.init(),
      BoardPresenter.#destinationsModel.init()
    ]).then(() => {
      document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#onNewEventButtonClick);
    });

  };

  #onFilterClick = (filterType) => {
    this.#currentFilterType = filterType;
    this.#handleModelEvent(UpdateType.MINOR);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointPresenters.get(update.id).setSaving();
        try {
          await BoardPresenter.#tripPointsModel.updateTripPoint(updateType, update);
        } catch (err) {
          this.#tripPointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#createEventForm.setSaving();
        try {
          await BoardPresenter.#tripPointsModel.addTripPoint(updateType, update);
        } catch(err) {
          this.#createEventForm.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointPresenters.get(update.id).setDeleting();
        try {
          await BoardPresenter.#tripPointsModel.deleteTripPoint(updateType, update);
        } catch (err) {
          this.#tripPointPresenters.get(update.id).setAborting();
        }
        break;
      default:
        new Error('Unknown user action ', actionType);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        this.#initCounter ++;
        if (this.#initCounter >= 3) {
          this.#isLoading = false;
          this.#uiBlocker.unblock();
          this.#renderPoints();
        }
        break;
      default:
        throw new Error('Unknown update type used');
    }
  };

  #onNewEventButtonClick = (evt) => {
    evt.preventDefault();
    this.#closeAllForms();
    this.#createEventForm = new EventFormView(
      EventFormViewMode.CREATE,
      null,
      BoardPresenter.#offersModel.offersByType,
      BoardPresenter.#destinationsModel.destinations
    );
    this.#createEventForm.setOnFormSubmit(this.#handleViewAction);
    this.#createEventForm.setOnFormCancel(this.#onCreateFormCancel);
    document.body.addEventListener('keydown', this.#onCreateFormKeyDown);
    render(this.#createEventForm, this.#tripPointsContainer, 'afterbegin');
  };

  #closeAllForms = () => {
    for(const pres of this.#tripPointPresenters.values()) {
      pres.switchViewToItem();
    }
    this.#cancelEventForm();
  };

  #cancelEventForm = () => {
    this.#createEventForm?.cancel();
    this.#createEventForm = null;
    document.body.removeEventListener('keydown', this.#onCreateFormKeyDown);
  };

  #onCreateFormCancel = () => {
    this.#cancelEventForm();
  };

  #onCreateFormKeyDown = (evt) => {
    if(evt.key === 'Escape') {
      evt.preventDefault();
      this.#cancelEventForm();
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
    this.#clearBoard();
    this.#renderPoints();
  };

  #renderFilter = () => {
    render(this.#filterView, document.querySelector('.trip-controls__filters'));
  };

  #clearBoard = (resetSortType) => {
    for(const pres of this.#tripPointPresenters.values()) {
      pres.removePoint();
    }
    this.#tripPointPresenters.clear();
    remove(this.#createEventForm);
    this.#createEventForm = null;

    if (resetSortType) {
      this.#currentSortType = resetSortType;
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
        this.#tripPointsContainer,
        {
          onDataChange: this.#handleViewAction,
          onTripPointClick: () => {
            this.#closeAllForms();
            tripPointPresenter.switchViewToForm();
          }
        }
      );

      this.#tripPointPresenters.set(tripPoint.id, tripPointPresenter);

      tripPointPresenter.init(tripPoint);
    }
  };

}
