import BoardPresenter from './presenter/board-presenter.js';
import { render } from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';

const filters = ['future', 'everything'];
const sortTypes = ['day', 'event', 'time', 'price', 'offer'];

render(new FilterView(filters), document.querySelector('.trip-controls__filters'));
render(new SortView(sortTypes), document.querySelector('.trip-events__sort'));

const tripPointsContainer = document.querySelector('.trip-events__list');
const boardPresenter = new BoardPresenter({tripPointsContainer});

boardPresenter.init();

