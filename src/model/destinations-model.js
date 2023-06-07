import { randomString } from '../framework/utils/random-utils';

export default class DestinationsModel {

  #destinations = [];

  constructor() {
    this.#destinations = Array.from({length: 10}, (_, i) => ({
      'id': i,
      'description': randomString(10),
      'name': randomString(10),
      'pictures': [
        {
          'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
          'description': 'Chamonix parliament building'
        }
      ]
    }));
  }

  get destinations() {
    return this.#destinations;
  }

}
