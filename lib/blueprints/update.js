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
        if (item.updateSteganoImage) {
          return util.updateRegistryPath(collection, item.updateSteganoImage, item.id, that.configs)
          .then(function(newPath) {
            delete item.updateSteganoImage;
            item.steganoImage = 'http://localhost:1337/' + newPath;
            item.steganoImage = item.steganoImage.replace('/assets', '');

            return that.steganoWrite
            .write(newPath, that.configs.key, JSON.stringify(item))
            .then(function(response) {
              return item;
            });
          });
        } else {
          var addressToEdit = that.configs.dbPath + 'SteganoDB' + _.last(item.steganoImage.split('SteganoDB'));
          return that.steganoWrite
          .write(addressToEdit, that.configs.key, JSON.stringify(item))
          .then(function() {
            return item;
          });
        }
      });
    });
  });
};
