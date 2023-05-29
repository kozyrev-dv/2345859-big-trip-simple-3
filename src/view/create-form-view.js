import {View} from './abstract-view.js';

const createCreateFormViewTemplate = () => '';

/**
 * Create form view
 *
 * @class CreateFormView
 * @extends {View}
 */

export default class CreateFormView extends View{

  constructor() {
    super(createCreateFormViewTemplate());
  }

}
