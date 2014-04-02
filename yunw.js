HelloController = function ($Greeter, message) {
  Greeter.say(message);
};

yunw = {
  functionRegex: /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
  getDependencies: function (arguments) {
    var self = this;
    return arguments.map(function (dependencyName) {
      return self.dependencies[dependencyName];
    });
  },
  process: function (target) {
    var source    = target.toString();
    var arguments = source.match(this.functionRegex)[1].split(',');
    target.apply(target, this.getDependencies(arguments));
  },
  register: function (name, dependency) {
    this.dependencies[name] = dependency;
  },
  dependencies: {}
};

StandardGreeter = {
  say: function (message) {
    console.log(message);
  }
};

HelloGreeter = {
  say: function (message) {
    console.log('Hello! ' + message);
  }
};

yunw.register('$Greeter', StandardGreeter);
