const { create } = require("../models/guide");

// Create string for SQL array insertion

const createSQLArrayString = (data) => {
  let arr = data.split(',');
  let str = '{';
  arr.forEach(type => str += `"${type}", `); 
  str = str.slice(0, str.length-2) + '}'; // Replace ending comma with '}'
  return str;
}

module.exports = createSQLArrayString;