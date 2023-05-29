import {View} from './abstract-view.js';

const createSortElementTemplate = () => '';

/**
 * Sort element view
 *
 * @class SortView
 * @extends {View}
 */

export default class SortView extends View{

  constructor() {
    super(createSortElementTemplate());
  }

}
