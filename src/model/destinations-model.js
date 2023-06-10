import Observable from '../framework/observable';
import { randomString } from '../framework/utils/random-utils';
import { UpdateType } from '../moks/const';

export default class DestinationsModel extends Observable{

  #tripPointApiService = null;
  #destinations = [];

  constructor(tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
    // this.#destinations = Array.from({length: 10}, (_, i) => ({
    //   'id': i,
    //   'description': randomString(10),
    //   'name': randomString(10),
    //   'pictures': [
    //     {
    //       'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
    //       'description': 'Chamonix parliament building'
    //     }
    //   ]
    // }));
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {

    try {
      this.#destinations = await this.#tripPointApiService.getDestinations();
    } catch(err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);

  };

}
