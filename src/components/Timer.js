import React, { useState, useEffect } from 'react';

function Timer() {
  const [deltaTime, setDeltaTime] = useState(0);
  const [prevTime, setPrevTime] = useState(null);
  const [started, setStarted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerAmount, setTimerAmount] = useState(0); 
  const [timeInput, setTimeInput] = useState("");
  const [alert, setAlert] = useState(null);
  const [running, setRunning] = useState(false);

  const timer = () => {
    if (started && running) {
      const curTime = new Date();
      let newDeltaTime = deltaTime;
      if (prevTime) {
        newDeltaTime += (curTime.getTime() - prevTime.getTime()) * multiplier;
      }

      console.log(multiplier);
      

      if (newDeltaTime >= 1000) {
        newDeltaTime = newDeltaTime % 1000;
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);

        if (!alert && newTimeLeft * 2 < timerAmount) {
          setAlert("More than halfway there!")
        }

        if (newTimeLeft === 0) {
          setStarted(false);
          setRunning(false);
          setDeltaTime(0);
          setPrevTime(null);
          setAlert("Time's up!");
          return;
        }
      }

      setDeltaTime(newDeltaTime);
      setPrevTime(curTime);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(timer, 100);
    return () => clearTimeout(timeout);
  }, [started, running, prevTime]);


  const startTimer = () => {
    if (parseInt(timeInput) > 0) {
      setTimerAmount(parseInt(timeInput) * 60);
      setTimeLeft(parseInt(timeInput) * 60);
      setStarted(true);
      setRunning(true);
      setDeltaTime(0);
      setPrevTime(null);
      setAlert(null);
    }
  }
  

  const onResume = () => {
    setRunning(true);
  }
  const onPause = () => {
    if (prevTime) {
      const newDeltaTime = deltaTime +  ((new Date()).getTime() - prevTime.getTime()) * multiplier;
      setDeltaTime(newDeltaTime);
      setPrevTime(null);
    }
    setRunning(false);
  }

  const onChangeInput = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setTimeInput(value);
    }
  }

  let minutes = Math.floor(timeLeft / 60);
  let seconds = Math.floor(timeLeft % 60);

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  } 

  return (
    <div class="container">
      <div class="input_container">
        <span class="font-weight-bold">Countdown: </span>
        <input class="form-control w-75 ml-2" size="sm" type="text" value={timeInput} onChange={onChangeInput} placeholder="(Min)" />
        <button class="btn btn-success ml-2 rounded-0 w-50" onClick={startTimer}>Start</button>
      </div>
      {alert && (
        <div>{alert}</div>
      )}

      <div class="mt-4">
        <span class="font-weight-bold font-italic">More than halfway there!</span>
        <h1>{minutes}:{seconds}</h1>        
          {started && (
            <span>
              {running ? (
                <button class="btn btn-warning btn-xs" onClick={onPause}>Pause</button>
              ) : (
                <button class="btn btn-primary btn-xs" onClick={onResume}>Resume</button>
              )}
            </span>
            
          )}
      </div>

      <div class="controls mt-3">
        <button class="btn btn-lg btn-secondary" onClick={() => setMultiplier(1)}>1X</button>
        <button class="btn btn-lg btn-secondary" onClick={() => setMultiplier(1.5)}>1.5X</button>
        <button class="btn btn-lg btn-secondary" onClick={() => setMultiplier(2)}>2X</button>
      </div>      
    </div>
  );
}

export default Timer;
