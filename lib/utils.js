var fs = require('fs-promise');
var _  = require('lodash');

module.exports = {
  getCollectionPath: function (collection, configs) {
    return configs.dbPath + 'SteganoDB' + '/' + configs.dbName + '/' + 'collections' + '/' + collection + '/';
  },

  getCollectionFiles: function (collection, configs) {
    return fs.walk(this.getCollectionPath(collection, configs))
    .then(function(files) {
      var allowedExtension = ['png'];

      files = _.map(files, 'path');
      _.remove(files, function(item) {
        var extension = _.last(item.split('.'));
        return !_.includes(allowedExtension, extension);
      });
      return files;
    });
  },

  getPathId: function(path) {
    var id = _.last(path.split('/'));
    return _.first(id.split('.'));
  },

  generateRegistryPath: function(collection, currentPath, configs) {
    var collectionPath = this.getCollectionPath(collection, configs),
      collectionId = this.generateId(),
      newPath = collectionPath + collectionId + '.png';

      return fs.rename(currentPath, newPath)
      .then(function(d) {
        return newPath;
      });
  },

  generateId: function() {
    var chars = "123456789",
      id = '';
    for (var x = 0; x < 16; x++) {
      var i = Math.floor(Math.random() * 9);
      id += chars.charAt(i);
    }
    return id;
  }
}
