module.exports = function(Fixtures) {
	// remote method before hook
  Fixtures.beforeRemote('create', function(context, fixture, next) {
    console.log('Putting in the Fixtures key, starting the engine.');
    console.log(fixture);
    next();
  });
  Fixtures.beforeRemote('save', function(context, fixture, next) {
    console.log('Save:Putting in the Fixtures key, starting the engine.');
    console.log(fixture);
    next();
  });
  // remote method after hook
  Fixtures.afterRemote('import', function(context, remoteMethodOutput, next) {
    console.log('Turning off the engine, removing the key.');
    next();
  });
};