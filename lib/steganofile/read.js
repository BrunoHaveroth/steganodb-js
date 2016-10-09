var Jimp = require('jimp');

module.exports = {
  read: function (path, key) {
    var that = this;

    return Jimp.read(path)
    .then(function (image) {
      var width  = image.bitmap.width;
      var height = image.bitmap.height;

      var textSize = that._readLengthText(image, width, height);
      var x, y = 0, keyIndex = 0;
      var text = '';
      var readLetterResult;

      x = that._getNextPosition(null, key.charAt(keyIndex));
      keyIndex++;

      for (var l = 0; l < textSize; l++) {
        readLetterResult = that._readLetter(x, y, image);
        text += readLetterResult.letter;

        if (keyIndex < key.length) {
          x += that._getNextPosition(null, key.charAt(keyIndex));
          keyIndex++;
        } else {
          x += that._getNextPosition(readLetterResult.rgbColor, null);
        }

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
      letter   : String.fromCharCode(parseInt(codeLetter)),
      rgbColor : rgbColor
    }
  },

  _getValueOfRgb: function(rgbProperty) {
    var value = rgbProperty.toString();
    return value.substring(value.length -1, value.length);
  },

  _getNextPosition: function(rgb, keyLetter) {
    var nextPosition;
    if (rgb) {
      nextPosition = rgb.a.toString();
      nextPosition = nextPosition.substring(nextPosition.length -1, nextPosition.length);
    } else {
      nextPosition = keyLetter.charCodeAt(0);
    }

    return parseInt(nextPosition) === 0 ? 1 : parseInt(nextPosition);
  },

  _readLengthText: function(image, width, height) {
    // Takes the number of decimal places used by the characters of the text size
    var decimalQuantity = Jimp.intToRGBA(image.getPixelColor(width -1, height -1));
    decimalQuantity = decimalQuantity.r.toString();
    decimalQuantity = parseInt(decimalQuantity.substring(decimalQuantity.length -1, decimalQuantity.length));
    // Calculating the number of pixels used to store text size
    var pixelQuantity   = ((decimalQuantity / 3) > 1) ? 2 : 1;
    var lengthText = '';
    var rgbProperties = ['r', 'g', 'b'];

    // Through each image position
    pixelQuantity += 2;
    for (var i = 2; i < pixelQuantity; i++) {
      // Get the RGB o pixel
      var decimalValue = Jimp.intToRGBA(image.getPixelColor(width - i, height - 1));
      var lengthRgb;

      // Check in which RGB property is stored the text text data
      if (decimalQuantity > 3) {
        lengthRgb = 3;
        decimalQuantity -= 3;
      } else {
        lengthRgb = decimalQuantity;
      }

      // Together all the latest decimal places of the RGB properties and stores in the variable lengthText
      for (var x = 0; x < lengthRgb; x++) {
        var value = decimalValue[rgbProperties[x]].toString();
        lengthText += value.substring(value.length -1, value.length);
      }
    }

    return parseInt(lengthText) + 1;
  }
};
