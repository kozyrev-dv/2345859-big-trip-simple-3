import AbstractView from '../framework/abstract-view';

const createTripPointTemplate = () => '';

/**
 * Trip point view
 *
 * @class TripPointView
 * @extends {AbstractView}
 */

export default class TripPointView extends AbstractView{

  constructor() {
    super(createTripPointTemplate());
  }

}
