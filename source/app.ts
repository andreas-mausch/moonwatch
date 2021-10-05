import '../config.xml';
import '../css/style.scss';
import '../tizen/tizenMock';
import { TZDate } from './tizen';

import moonPhase from './moonPhase';

const rotateElement = (elementID: string, angle: number) => {
  const element = document.querySelector("#" + elementID) as HTMLElement;
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

const updateColor = (month: number) => {
  const filter = `hue-rotate(${360 / 12 * (month + 1)}deg)`;

  [
    '.date',
    '#hand-main-hour',
    '#hand-main-minute',
    '#hand-main-second'
  ].forEach((selector) => {
    const element = document.querySelector(selector) as HTMLElement;
    element.style.webkitFilter = filter;
  })
}

const updateTime = () => {
  const datetime = global.tizen.time.getCurrentDateTime(),
    hour = datetime.getHours(),
    minute = datetime.getMinutes(),
    second = datetime.getSeconds();

  rotateElement("hand-main-hour", (hour + (minute / 60) + (second / 3600)) * 30);
  rotateElement("hand-main-minute", (minute + second / 60) * 6);
  rotateElement("hand-main-second", second * 6);

  updateDate(toJsDate(datetime));
  updateMoonPhase(toJsDate(datetime));
  updateColor(datetime.getMonth())

  const background = document.querySelector("#background-moon") as HTMLElement;
  background.style.visibility = 'visible';
}

const showOverlay = () => {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.visibility = "visible";
  }
}

const hideOverlay = () => {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.visibility = "hidden";
  }
}

const bindEvents = () => {
  document.addEventListener("visibilitychange", function () {
    const visible = document.visibilityState === 'visible';
    if (visible) {
      updateTime();
      hideOverlay();
    }
  });

  // Add eventListener to update the screen when the time zone is changed
  global.tizen.time.setTimezoneChangeListener(() => {
    updateTime();
  });

  document.getElementById("components-main")?.addEventListener("click", () => {
    const overlay = document.getElementById("overlay");
    if (overlay) {
      if (window.position) {
        overlay.innerText = `${window.position.coords.latitude}`;
      } else {
        overlay.innerText = "Couldn't get position";
      }
      showOverlay();

      setTimeout(() => {
        hideOverlay();
      }, 5000);
    }
  });

  updateTime();
}

window.onload = () => {
  bindEvents();

  // Update the watch hands every second
  setInterval(function () {
    updateTime();
  }, 1000);

  navigator.geolocation.getCurrentPosition(position => { window.position = position; });
}
