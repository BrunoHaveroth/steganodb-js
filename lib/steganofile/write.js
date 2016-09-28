var Jimp = require('jimp');

module.exports = {
  write: function(path, key, text) {
    console.log('Tamanho> ', text.length);
    var that = this;
    return Jimp.read(path)
    .then(function (image) {
      var width  = image.bitmap.width;
      var height = image.bitmap.height;
      var x = 1, y = 0, l =0;

      while ((l < text.length) || (y > height)) {
        var writeLetterResult = that._writeLetter(text[l], x, y, image);
        image = writeLetterResult.image;
        x     = x + writeLetterResult.nextPosition;
        if (x >= width) {
          x = 0;
          y++;
        } else {
          l++;
        }
      }

      image.write(path);
      return text;
    });
  },

  _writeLetter: function(letter, x, y, image) {
    var letterToColor = this._letterToColor(letter, image.getPixelColor(x, y));

    image.setPixelColor(letterToColor.intColor, x, y);
    return {
      image         : image,
      nextPosition  : letterToColor.nextPosition
    };
  },

  _letterToColor: function(letter, intColor) {
    var rgbColor   = Jimp.intToRGBA(intColor);
    var letterCode = letter.charCodeAt(0).toString();
    var codeNumber;
    var rgbProperties = ['r', 'g', 'b'];

    for (var l = 0; l < letterCode.length; l++) {
      codeNumber = parseInt(letterCode[l]);
      rgbColor[rgbProperties[l]] = this._insertValueInRgb(codeNumber, rgbProperties[l], rgbColor);
    }

    var rgba = rgbColor.a.toString();
    rgbColor.a = parseInt(rgba.substring(0, rgba.length -1) + letterCode.length);

    return {
      nextPosition : this._getNextPosition(rgbColor),
      intColor     : Jimp.rgbaToInt(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a)
    }
  },

  _insertValueInRgb: function(value, rgbProperty, rgbColor) {
    var rgbPropertyValue = rgbColor[rgbProperty].toString();
    var newRgbPropertyValue;

    rgbPropertyValue = rgbPropertyValue.toString();
    newRgbPropertyValue = rgbPropertyValue.substring(0, rgbPropertyValue.length -1) + value;
    newRgbPropertyValue = parseInt(newRgbPropertyValue);

    newRgbPropertyValue = (newRgbPropertyValue > 255) ? newRgbPropertyValue - 10 : newRgbPropertyValue;

    return newRgbPropertyValue;
  },

  _getNextPosition: function(rgb) {
    var nextPosition = rgb.a.toString();
    nextPosition = nextPosition.substring(nextPosition.length -1, nextPosition.length);
    return parseInt(nextPosition) === 0 ? 1 : parseInt(nextPosition);
  }
};
