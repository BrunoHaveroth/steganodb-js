var util        = require('../utils');
var queryFilter = require('../query-filter');
var Promise     = require('bluebird');
var fs = require('fs');

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
      response = queryFilter.applyFilters(response, options);
      response.forEach(function(item) {
        var addressToRemove = that.configs.dbPath + 'SteganoDB' + _.last(item.steganoImage.split('SteganoDB'));
        fs.unlinkSync(addressToRemove);
      });

      return response;
    });
  });
};
