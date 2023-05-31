export default class DestinationModel {

  #name = null;
  #description = null;
  #pictures = null;
  #id = null;

  constructor(id, name, description, pictures) {
    this.#id = id;
    this.#description = description;
    this.#name = name;
    this.#pictures = pictures;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get pictures() {
    return this.#pictures;
  }

  get destination() {
    return {
      'name' : this.#name,
      'description' : this.#description,
      'pictures' : this.#pictures
    };
  }

}
