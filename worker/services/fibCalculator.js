exports.fib = (index) =>
  index < 2 ? 1 : this.fib(index - 1) + this.fib(index - 2);
