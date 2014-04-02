Y U NO WORK Dependency Injection?!
==================================

Dependency Injection is awesome, but hard to understand. So let's break it down. Here are some key steps to understand it:

  n. Introspection
  n. Regular Expressions
  n. Dependency Registration
  n. Evaluation

Introspection
-------------

With javascript, the source code of a function can be returned as a string. This allows us to inspect and change it. Example:

``` javascript
var HelloController = function ($Greeter, message) {
  $Greeter.say(message);
}

HelloController.toString();
// 'function ($Greeter, message) {\n$Greeter.say(message);\n}'
```

With that in mind we look at Regular Expressions.

Regular Expressions
------------------

The thing we want to inject is $Greeter. We don't know what the $Greeter is going to be in advance, but we do know that it's API supports #say(message). With that in mind we can create a regex to find which elements we need to inject.

``` javascript
var yunw = {
  functionRegex: /^function\s*[^\(]*\(\s*([^\)]*)\)/m
}
```

If we were to match against our controller we'd get a string of comma seperated arguments back like so:

``` javascript
HelloController.toString().match(yunw.functionRegex)[1];
// '$Greeter, message'
```

Now we move on to Dependency Registration.

Dependency Registration
-----------------------

Now we need to register dependencies. For now let's say we have two greeters: StandardGreeter, and HelloGreeter. We'll switch with those later. Here's the code to register:

``` javascript
yunw.register = function (name, dependency) {this.dependencies[name] = dependency;}

var StandardGreeter = {
  say: function (message) {
    console.log(message);
  }
};

var HelloGreeter = {
  say: function (message) {
    console.log('Hello! ' + message);
  }
};

yunw.register('$Greeter', StandardGreeter);
```

We went ahead and registered the StandardGreeter to give us something to process.

Evaluation
----------

Now we process all of this. I've chosen to split it up into three parts: getting arguments, Finding dependencies, and applying the dependencies.

Source
------

Here's the full source for this presentation

``` javascript
var HelloController = function ($Greeter, message) {
  $Greeter.say(message);
};

var yunw = {
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
  dependencies = {}
};

var StandardGreeter = {
  say: function (message) {
    console.log(message);
  }
};

var HelloGreeter = {
  say: function (message) {
    console.log('Hello! ' + message);
  }
};

yunw.register('$Greeter', StandardGreeter);
```
