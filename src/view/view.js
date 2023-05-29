import {createElement} from '../render.js';

/**
 * @abstract
 */
export default class View {

  #template = null;
  #element = null;

  constructor(template) {
    this.#template = template;
    this.#element = createElement(this.#template);
  }

  get template() {
    return this.#template;
  }

  set template(value) {
    this.#template = value;
  }

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.#template);
    }
    return this.#element;
  }

  set element(value) {
    this.#element = value;
  }

  removeElement() {
    this._element = null;
  }

}
