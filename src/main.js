import BoardPresenter from './presenter/board-presenter.js';

const tripPointsContainer = document.querySelector('.trip-events__list');
const boardPresenter = new BoardPresenter({tripPointsContainer});

boardPresenter.init();

