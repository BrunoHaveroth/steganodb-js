var Jimp = require('jimp');

module.exports = {
  write: function(path, key, text) {
    var that = this;
    return Jimp.read(path)
    .then(function (image) {
      var width  = image.bitmap.width;
      var height = image.bitmap.height;
      var x, y = 0, l = 0, keyIndex = 0;

      x = that._getNextPosition(null, key.charAt(keyIndex));
      keyIndex++;

      while ((l < text.length) || (y > height)) {
        var writeLetterResult = that._writeLetter(text[l], x, y, image);
        image = writeLetterResult.image;

        if (keyIndex < key.length) {
          x += that._getNextPosition(null, key.charAt(keyIndex));
          keyIndex++;
        } else {
          x += that._getNextPosition(writeLetterResult.rgbColor, null);
        }

        if (x >= width) {
          x = 0;
          y++;
        }

        l++;
      }

      image = that._writeLengthText(image, width, height, text.length);
      image.write(path);
      return text;
    });
  },

  _writeLetter: function(letter, x, y, image) {
    var letterToColor = this._letterToColor(letter, image.getPixelColor(x, y));

    image.setPixelColor(letterToColor.intColor, x, y);
    return {
      image     : image,
      rgbColor  : letterToColor.rgbColor
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
      rgbColor : rgbColor,
      intColor : Jimp.rgbaToInt(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a)
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

  _writeLengthText: function(image, width, height, textSize) {
    // Takes the number of decimal places used by the characters of the text size
    var length = textSize.toString().length;
    var rgbColor = Jimp.intToRGBA(image.getPixelColor(width - 1, height -1));
    var rgbProperty = rgbColor.r.toString();
    rgbProperty = rgbProperty.substring(0, rgbProperty.length -1) + length;
    rgbColor.r = parseInt(rgbProperty);
    image.setPixelColor(Jimp.rgbaToInt(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a), width - 1, height -1);

    // Calculating the number of pixels used to store text size
    var pixelQuantity = ((length / 3) > 1) ? 2 : 1,
    rgbProperties = ['r', 'g', 'b'],
    lengthIndex = 0,
    lengthRgb;

    // Through each image position
    pixelQuantity += 2;
    for (var i = 2; i <= pixelQuantity; i++) {
      // Get the RGB o pixel
      rgbColor = Jimp.intToRGBA(image.getPixelColor(width - i, height -1));

      // Check in which RGB property is stored the text text data
      if (length > 3) {
        lengthRgb = 3;
        length -= 3;
      } else {
        lengthRgb = length;
      }

      // Together all the latest decimal places of the RGB properties and stores in the variable lengthText
      for (var x = 0; x < lengthRgb; x++) {
        var newRgbProperty = rgbColor[rgbProperties[x]].toString();
        newRgbProperty = newRgbProperty.substring(0, newRgbProperty.length -1) + textSize.toString().charAt(lengthIndex);
        rgbColor[rgbProperties[x]] = parseInt(newRgbProperty);
        lengthIndex++;
      }
      image.setPixelColor(Jimp.rgbaToInt(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a), (width - i), height -1);
    }

    return image;
  }
};
