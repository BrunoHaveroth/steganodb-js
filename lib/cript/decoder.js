module.exports = {
  decode: function(text, key, type) {
    if (this[type]) {
      return this[type](text, key);
    } else {
      throw { message: 'Tipo de criptografia nao informado' };
    }
  },

  transposition: function(text, key) {
    var decryptText = '';
    for (var i = 0; i < text.length; i++) {
      var newLetter = text.charAt(i);
      var skipValue = (i < key.length) ? this.getSkipValue(key.charAt(i), 'key') : this.getSkipValue(text.charAt(i -1));
      newLetter = newLetter.charCodeAt(0);
      newLetter -= skipValue;
      newLetter = String.fromCharCode(newLetter);

      decryptText += newLetter;
    }
    return decryptText;
  },

  substitution: function(text, key) {
    keyIndex = key.length < text.length ? this.getKeyIndex(text, key) : text.length;
    for (var i = (text.length -1); i >= 0; i--) {
      var skipValue = this.getSkipValue(key.charAt(keyIndex));

      if (keyIndex > 0) {
        keyIndex--;
      } else {
        keyIndex = key.length -1;
      }

      var letterIndex = i + skipValue;
      letterIndex = letterIndex > text.length -1 ? (text.length -1) : letterIndex;
      text = this.changeLetterPosition(text, letterIndex, i);
    }
    return text;
  },

  getSkipValue: function(letter) {
    var skipValue = letter.charCodeAt(0).toString();
    skipValue = skipValue.substring(skipValue.length -1, skipValue.length);
    return parseInt(skipValue) === 0 ? 5 : parseInt(skipValue);
  },

  changeLetterPosition: function(string, currentPosition, newPosition) {
    var letter = string.charAt(currentPosition);

    string = string.substr(0, currentPosition).concat(string.substr(currentPosition + 1, string.length));
    string = string.substr(0, newPosition).concat(letter).concat(string.substr(newPosition, string.length));
    return string;
  },

  getKeyIndex: function(text, key) {
    var keyIndex = 0;
    for (var i = 0; i < text.length -1; i++) {
      keyIndex = keyIndex < key.length -1 ? keyIndex + 1 : 0;
    }
    return keyIndex;
  }
};
