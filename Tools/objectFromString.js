export default string => {
  return new Promise(resolve => {
    const obj = {};
    const arrayFromString = string.split('&&');

    arrayFromString.forEach(element => {
      const split = element.split(':');
      obj[split[0]] = split[1];
    });

    resolve(obj);
  });
};
