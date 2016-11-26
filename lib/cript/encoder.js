module.exports = {
  encode: function(text, key, type) {
    if (this[type]) {
      return this[type](text, key);
    } else {
      throw { message: 'Tipo de criptografia nao informado' };
    }
  },

  transposition: function(text, key) {
    var encryptText = '';
    for (var i = 0; i < text.length; i++) {
      var newLetter = text.charAt(i);
      var skipValue = (i < key.length) ? this.getSkipValue(key.charAt(i), 'key') : this.getSkipValue(encryptText.charAt(i -1));
      newLetter = newLetter.charCodeAt(0);
      newLetter += skipValue;
      newLetter = String.fromCharCode(newLetter);

      encryptText += newLetter;
    }
    return encryptText;
  },

  substitution: function(text, key) {
    var keyIndex = 0;
    for (var i = 0; i < text.length; i++) {
      var newLetter = text.charAt(i);
      var skipValue = this.getSkipValue(key.charAt(keyIndex));

      keyIndex = (keyIndex < key.length -1) ? keyIndex + 1 : 0;

      var newPosition = i + skipValue;
      newPosition = newPosition > text.length -1 ? (text.length -1) : newPosition;
      text = this.changeLetterPosition(text, i, newPosition);
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
  }
};
