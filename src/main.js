import TripPointApiService from './api/trip-point-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import TripPointsModel from './model/trip-points-model.js';
import BoardPresenter from './presenter/board-presenter.js';

const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic xzcSAS5bFwfsfSASrts';

const apiService = new TripPointApiService(END_POINT, AUTHORIZATION);

const tripPointsContainer = document.querySelector('.trip-events__list');
const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);
const tripPointsModel = new TripPointsModel(apiService);

const boardPresenter = new BoardPresenter({
  tripPointsModel: tripPointsModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  tripPointsContainer: tripPointsContainer
});


boardPresenter.init();
