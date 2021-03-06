var util    = require('../utils');

module.exports = function (collection, data) {
  var that = this,
    steganoImage = data.steganoImage;

  return util.generateRegistryPath(collection, steganoImage, this.configs)
  .then(function(newPath) {
    data.id = util.getPathId(newPath);
    data.steganoImage = 'http://localhost:1337/' + newPath;
    data.steganoImage = data.steganoImage.replace('/assets', '');

    return that.steganoWrite
    .write(newPath, that.configs.key, JSON.stringify(data))
    .then(function(response) {
      return JSON.parse(response);
    });
  });
};
