var blueprints = {
  create  : require('./lib/blueprints/create.js'),
  find    : require('./lib/blueprints/find.js'),
  destroy : require('./lib/blueprints/destroy.js')
};

var steganofile = {
  steganoRead   : require('./lib/steganofile/read.js'),
  steganoWrite  : require('./lib/steganofile/write.js')
};

function SteganoDB (key, dbName, dbPath) {
  if(!key) throw { name: 'MissingKey', message: 'A chave do banco de dados está faltando' };
  if(!dbName) throw { name: 'MissingKey', message: 'O nome do banco de dados está faltando' };

  if (!(this instanceof SteganoDB)) return new SteganoDB(key);

  // Set the configs
  this.configs = { key: key, dbName: dbName, dbPath: dbPath };


  // Load steganofile methods
  for (var s in steganofile)
    this[s] = steganofile[s];

  // Load blueprints methods
  for (var b in blueprints)
    this[b] = blueprints[b].bind(this);
};

module.exports = SteganoDB;
