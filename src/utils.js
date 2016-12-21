Number.prototype.toNumFixed = function (num) {
  return parseFloat(this.toFixed(num));
}

Array.prototype.toNumFixed = function (num) {
  for (var i = 0; i < this.length; i++) {
    this[i] = this[i].toNumFixed(num);
  }
  return this;
}
