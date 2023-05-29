import AbstractView from '../framework/abstract-view';

const createCreateFormViewTemplate = () => '';

/**
 * Create form view
 *
 * @class CreateFormView
 * @extends {AbstractView}
 */

export default class CreateFormView extends AbstractView{

  constructor() {
    super(createCreateFormViewTemplate());
  }

}
