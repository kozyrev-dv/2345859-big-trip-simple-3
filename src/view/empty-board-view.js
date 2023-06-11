import AbstractView from '../framework/view/abstract-view';

const createEmptyBoardViewTemplate = () => `
  <p class="trip-events__msg">Click New Event to create your first point</p>
`;

export default class EmptyBoardView extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createEmptyBoardViewTemplate();
  }

}
