import '../config.xml'
import '../css/style.scss'

import suncalc from 'suncalc'

/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
    function rotateElement(elementID: string, angle: number) {
        const element = document.querySelector("#" + elementID) as HTMLElement
        element.style.transform = "rotate(" + angle + "deg)";
    }

    function moonPhase() {
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

    function toJsDate(tzDate: TZDate) {
        return new Date(tzDate.getFullYear(), tzDate.getMonth(), tzDate.getDate(), tzDate.getHours(), tzDate.getMinutes(), tzDate.getSeconds(), tzDate.getMilliseconds());
    }

    function updateTime() {
        const datetime = tizen.time.getCurrentDateTime(),
            hour = datetime.getHours(),
            minute = datetime.getMinutes(),
            second = datetime.getSeconds();

        rotateElement("hand-main-hour", (hour + (minute / 60) + (second / 3600)) * 30);
        rotateElement("hand-main-minute", (minute + second / 60) * 6);
        rotateElement("hand-main-second", second * 6);

        moonPhase();
    }

    function bindEvents() {
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

    function init() {
        bindEvents();

        // Update the watch hands every second
        setInterval(function() {
            updateTime();
        }, 1000);
    }

    window.onload = init;
}());
