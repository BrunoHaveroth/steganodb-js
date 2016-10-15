var util        = require('../utils');
var queryFilter = require('../query-filter');
var Promise     = require('bluebird');

module.exports = function (collection, options) {
  var that = this;
  return util
  .getCollectionFiles(collection, this.configs)
  .then(function(collectionFiles) {
    return Promise.map(collectionFiles, function(collectionFile) {
      return that.steganoRead
      .read(collectionFile, that.configs.key)
      .then(function(response) {
        return JSON.parse(response);
      });
    }).then(function(response) {
      return queryFilter.applyFilters(response, options);
    });
  });
};
