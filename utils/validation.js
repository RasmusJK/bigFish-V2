/* eslint-disable max-len */
import validate from 'validate.js';

const validateField = (attr, constraints) => {
  // console.log('atts', attr);
  const attrName = Object.keys(attr).pop(); // get the only or last item from array
  const valResult = validate(attr, constraints);
  // console.log('valresult', valResult);
  let valid = undefined;
  if (valResult !== undefined && valResult[attrName]) {
    valid = valResult[attrName][0]; // get just the first message
  }
  return valid;
};

export {validateField};
