var _  = require('lodash');

module.exports = {
  applyFilters: function (results, options) {
    var that = this;
    _.forEach(options, function (value, key) {
      if (that[key] && value) results = that[key](results, value);
    });
    return results;
  },

  where: function (results, query) {
    // if (query.id) query.id = query.id.toString();
    return _.filter(results, query);
  },

  limit: function (results, limit) {
    return _.slice(results, 0, limit);
  }
}
