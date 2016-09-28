var Jimp = require('jimp');

module.exports = {
  read: function (path, key) {
    var that = this;

    return Jimp.read(path)
    .then(function (image) {
      var width  = image.bitmap.width;
      var height = image.bitmap.height;
      var x = 1, y = 0;
      var text = '';
      var readLetterResult;

      for (var l = 0; l < 220; l++) {
        readLetterResult = that._readLetter(x, y, image);
        text += readLetterResult.letter;
        x += readLetterResult.nextPosition;

        if (x >= width) {
          x = 0;
          y++;
        }
      }
      return text;
    });
  },

  _readLetter: function(x, y, image) {
    return this._colorToLetter(image.getPixelColor(x, y));
  },

  _colorToLetter: function(intColor) {
    var rgbColor    = Jimp.intToRGBA(intColor);
    var lengthColor = rgbColor.a.toString();
    lengthColor     = parseInt(lengthColor.substring(lengthColor.length -1, lengthColor.length));
    var codeLetter = '';
    var rgbProperties = ['r', 'g', 'b'];
    for (var l = 0; l < lengthColor; l++) {
      codeLetter += this._getValueOfRgb(rgbColor[rgbProperties[l]]);
    }
    return {
      letter: String.fromCharCode(parseInt(codeLetter)),
      nextPosition: this._getNextPosition(rgbColor)
    }
  },

  _getValueOfRgb: function(rgbProperty) {
    var value = rgbProperty.toString();
    return value.substring(value.length -1, value.length);
  },

  _getNextPosition: function(rgb) {
    var nextPosition = rgb.a.toString();
    nextPosition = nextPosition.substring(nextPosition.length -1, nextPosition.length);
    return parseInt(nextPosition) === 0 ? 1 : parseInt(nextPosition);
  }
};
