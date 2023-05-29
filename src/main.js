import { render } from './render.js';
import FilterView from './view/filter-view.js';

const filters = ['future', 'everything'];

render(new FilterView(filters), document.querySelector('.trip-controls__filters'));
