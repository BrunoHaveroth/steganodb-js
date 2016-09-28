var util    = require('../utils');
var Promise = require('bluebird');

module.exports = function (collection) {
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
    });
  });
};
