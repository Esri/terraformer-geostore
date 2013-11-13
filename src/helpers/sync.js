// super lightweight async to sync handling

function Sync () {
	this._steps = [ ];
  this._arguments = [ ];
  this._current = 0;
  this._error = null;
}

Sync.prototype.next = function () {
  var args = Array.prototype.slice.call(arguments);
  this._steps.push(args.shift());
  this._arguments[this._steps.length - 1] = args;

  return this;
};

Sync.prototype.error = function (error) {
  this._error = error;

  return this;
};

Sync.prototype.done = function (err) {
  this._current++;
  var args = Array.prototype.slice.call(arguments);

  // if there is an error, we are done
  if (err) {
    if (this._error) {
      this._error.apply(this, args);
    }
  } else {
    if (this._steps.length) {
      var next = this._steps.shift();
      var a = this._arguments[this._current];
      var self = this;

      function cb (err, data) {
        self.done(err, data);
      };
      a.push(cb);
      next.apply(this, a);
    } else {
      if (this._callback) {
        this._callback.apply();
      }
    }
  }
};

Sync.prototype.start = function (callback) {
  this._callback = callback;

  var start = this._steps.shift(),
      self  = this;

  if (start) {
    var args = this._arguments[0];
    function cb (err, data) {
      self.done(err, data);
    };
    args.push(cb);
    start.apply(this, args);
  } else {
    if (this._callback) {
      this._callback();
    }
  }
};

