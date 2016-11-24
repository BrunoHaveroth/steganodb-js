var _  = require('lodash');

module.exports = {
  applyFilters: function (results, options) {
    var that = this,
      reservedWords = ['contains'];
    _.forEach(options.where, function(value, key) {
      if (_.includes(reservedWords, key)) {
        options[key] = value;
        delete options.where[key];
      }
    });
    
    _.forEach(options, function (value, key) {
      if (that[key] && value) results = that[key](results, value);
    });
    return results;
  },

  contains: function (results, contains) {
    _.remove(results, function(obj) {
      var remove = true;

      _.forEach(contains, function(value, key) {
        if (obj[key] && obj[key].indexOf(value) != -1) {
          remove = false;
        }
      });

      return remove;
    });
    return results;
  },

  where: function (results, query) {
    if (query.id) query.id = query.id.toString();
    return _.filter(results, query);
  },

  limit: function (results, limit) {
    return _.slice(results, 0, limit);
  }
}
