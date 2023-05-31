
const randomInt = (scale = 1, offset = 0) => Math.floor(Math.random() * scale) + offset;

const randomString = (length = 10) => (Math.random() + 1).toString(36).substring(length);

export {randomInt, randomString};
