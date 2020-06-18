import '../config.xml'
import '../css/style.scss'

import suncalc from 'suncalc'

const rotateElement = (elementID: string, angle: number) => {
  const element = document.querySelector("#" + elementID) as HTMLElement
  element.style.transform = "rotate(" + angle + "deg)";
}

const toJsDate = (tzDate: TZDate) => {
  return new Date(tzDate.getFullYear(), tzDate.getMonth(), tzDate.getDate(), tzDate.getHours(), tzDate.getMinutes(), tzDate.getSeconds(), tzDate.getMilliseconds());
}

const updateMoonPhase = () => {
  const positions = [
                   "-1110px -1840px",
                   "-45px -50px",
                   "-405px -50px",
                   "-760px -50px",
                   "-1120px -50px",
                   "-35px -410px",
                   "-390px -410px",
                   "-750px -410px",
                   "-1110px -410px",
                   "-35px -770px",
                   "-390px -770px",
                   "-750px -770px",
                   "-1110px -770px",
                   "-35px -1125px",
                   "-390px -1125px",
                   "-750px -1125px",
                   "-1110px -1125px",
                   "-35px -1480px",
                   "-390px -1480px",
                   "-750px -1480px",
                   "-1110px -1480px",
                   "-35px -1840px",
                   "-390px -1840px",
                   "-750px -1840px",
  ];

  const illumination = suncalc.getMoonIllumination(toJsDate(tizen.time.getCurrentDateTime()));

  const position = positions[Math.round(positions.length * illumination.phase)];
  const element = document.querySelector("#background-moon") as HTMLElement;
  element.style.backgroundPosition = position;
}

const updateTime = () => {
  const datetime = tizen.time.getCurrentDateTime(),
      hour = datetime.getHours(),
      minute = datetime.getMinutes(),
      second = datetime.getSeconds();

  rotateElement("hand-main-hour", (hour + (minute / 60) + (second / 3600)) * 30);
  rotateElement("hand-main-minute", (minute + second / 60) * 6);
  rotateElement("hand-main-second", second * 6);

  const date = document.querySelector("#date") as HTMLElement;
  date.innerText = datetime.getDate();

  updateMoonPhase();

  const background = document.querySelector("#background-moon") as HTMLElement;
  background.style.visibility = 'visible';
}

const bindEvents = () => {
  // Add an event listener to update the screen immediately when the device wakes up
  document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
          updateTime();
      }
  });

  // Add eventListener to update the screen when the time zone is changed
  tizen.time.setTimezoneChangeListener(function() {
      updateTime();
  });
}

window.onload = () => {
  bindEvents();

  // Update the watch hands every second
  setInterval(function() {
      updateTime();
  }, 1000);
}
