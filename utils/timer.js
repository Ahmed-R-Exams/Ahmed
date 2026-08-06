let timer = null;

export function stopTimer() {
  clearInterval(timer);
}

export function startTimer(updateCallback, finishCallback) {

  stopTimer();

  timer = setInterval(() => {

    const shouldContinue = updateCallback();

    if (!shouldContinue) {

      stopTimer();

      finishCallback();

    }

  }, 1000);

}