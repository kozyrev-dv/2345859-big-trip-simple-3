import AbstractView from '../framework/view/abstract-view';

const createErrorBoardViewTemplate = () => `
  <p class="trip-events__msg">Something went wrong. Please try again later</p>
`;

export default class ServerErrorView extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createErrorBoardViewTemplate();
  }

}
