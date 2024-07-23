let timerId = null;
let startTime = null;
let pausedTime = null;
let elapsedTime = 0;

self.onmessage = function (event) {
  const { action, timeStart } = event.data;

  if (action === 'start') {
    startTime = new Date(timeStart).getTime();
    pausedTime = null;
    elapsedTime = 0;
    tick();
  } else if (action === 'stop') {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      pausedTime = new Date().getTime();
    }
  } else if (action === 'resume') {
    if (pausedTime) {
      const pausedDuration = new Date().getTime() - pausedTime;
      startTime += pausedDuration;
      pausedTime = null;
      tick();
    }
  } else if (action === 'reset') {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    startTime = new Date(timeStart).getTime();
    pausedTime = null;
    elapsedTime = 0;
    tick();
  }
};

function tick() {
  const now = new Date().getTime();
  elapsedTime = now - startTime;
  self.postMessage({ type: 'tick', elapsed: elapsedTime });  // postMessage to send elapsed time
  clearTimeout(timerId);
  timerId = setTimeout(tick, 1000 - (elapsedTime % 1000));
}
