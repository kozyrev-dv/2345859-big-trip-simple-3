
import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class TripPointApiService extends ApiService{

  getTripPoints = () => this._load({url: 'points'}).then(ApiService.parseResponse);

  getDestinations = () => this._load({url: 'destinations'}).then(ApiService.parseResponse);

  getOffers = () => this._load({url: 'offers'}).then(ApiService.parseResponse);

  async updatePoint(tripPoint) {
    const response = await this._load({
      url: `points/${tripPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(tripPoint) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(tripPoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(tripPoint) {
    const response = await this._load({
      url: `points/${tripPoint.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(tripPoint) {
    const adaptedPoint = {...tripPoint,
      'base_price': Number(tripPoint.basePrice),
      'date_from': (tripPoint.dateFrom) ? new Date(tripPoint.dateFrom).toISOString() : new Date().toISOString,
      'date_to': (tripPoint.dateFrom) ? new Date(tripPoint.dateTo).toISOString() : new Date().toISOString,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    return adaptedPoint;
  }

}
