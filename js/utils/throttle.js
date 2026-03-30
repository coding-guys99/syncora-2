export function throttle(callback, wait = 100) {
  let shouldWait = false;
  let pendingArgs = null;

  const timeoutFn = () => {
    if (pendingArgs == null) {
      shouldWait = false;
      return;
    }

    callback(...pendingArgs);
    pendingArgs = null;
    setTimeout(timeoutFn, wait);
  };

  return (...args) => {
    if (shouldWait) {
      pendingArgs = args;
      return;
    }

    callback(...args);
    shouldWait = true;
    setTimeout(timeoutFn, wait);
  };
}
