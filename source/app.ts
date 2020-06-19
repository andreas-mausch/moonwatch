import '../config.xml'
import '../css/style.scss'

import moonPhase from './moonPhase'

const rotateElement = (elementID: string, angle: number) => {
  const element = document.querySelector("#" + elementID) as HTMLElement
  element.style.transform = "rotate(" + angle + "deg)";
}

const toJsDate = (tzDate: TZDate) => {
  return new Date(tzDate.getFullYear(), tzDate.getMonth(), tzDate.getDate(), tzDate.getHours(), tzDate.getMinutes(), tzDate.getSeconds(), tzDate.getMilliseconds());
}

const updateMoonPhase = (date: Date) => {
  const element = document.querySelector("#background-moon") as HTMLElement;
  element.style.backgroundPosition = moonPhase(date);
}

const updateDate = (date: Date) => {
  const dateElement = document.querySelector("#date") as HTMLElement;
  dateElement.innerText = date.getDate().toString();

  const dayElement = document.querySelector("#day") as HTMLElement;
  dayElement.innerText = date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
}

const updateTime = () => {
  const datetime = tizen.time.getCurrentDateTime(),
      hour = datetime.getHours(),
      minute = datetime.getMinutes(),
      second = datetime.getSeconds();

  rotateElement("hand-main-hour", (hour + (minute / 60) + (second / 3600)) * 30);
  rotateElement("hand-main-minute", (minute + second / 60) * 6);
  rotateElement("hand-main-second", second * 6);

  updateDate(toJsDate(datetime));
  updateMoonPhase(toJsDate(datetime));

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
