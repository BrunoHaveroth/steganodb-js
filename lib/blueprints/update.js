var util        = require('../utils');
var queryFilter = require('../query-filter');
var Promise     = require('bluebird');

module.exports = function (collection, options, data) {
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
      response = queryFilter.applyFilters(response, options);

      response = _.map(response, function(item) {
        return _.assign(item, data);
      });

      return Promise.map(response, function(item) {
        return that.steganoWrite
        .write(item.steganoImage, that.configs.key, JSON.stringify(item))
        .then(function() {
          return item;
        });
      });
    });
  });
};
