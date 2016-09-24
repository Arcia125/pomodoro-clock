var $ = require('jquery');
require('jquery-ui-bundle');
require('./index.html');
require('./main.less');

var endTime;
var breakEndTime;
var timeInterval;
var timerState;
var timeDigits = $('.time-digit');
var hoursSpan = $('.hours');
var minutesSpan = $('.minutes');
var secondsSpan = $('.seconds');
var startButton = $('.start-timer');
var resetButton = $('.reset-timer');
var sessionTimeInput = $('#spinner');
var breakTimeInput = $('#spinner2');
var title = $('h1');
var sessionTime;
var breakTime;
var total;
var times;

var spinnerInit = $('#spinner').spinner();
var spinner2Init = $('#spinner2').spinner();
var startButtonInit = $('.timer-button').button();
$('.ui-icon-triangle-1-n').html('+');
$('.ui-icon-triangle-1-s').html('-');
title.html('Session');

function minutesToMs(minutes) {
    return minutes * 60000;
}

function msToSeconds(milliseconds) {
    return milliseconds / 1000;
}

function secondsToMinutes(seconds) {
    return seconds / 60;
}

function minutesToHours(minutes) {
    return minutes / 60;
}

function setTimer(minutes) {
    endTime = minutesToMs(minutes);
}

function setBreak(minutes) {
    breakEndTime = minutesToMs(minutes);
}

function getTimeTotals(milliseconds) {
    var totalSeconds = msToSeconds(milliseconds);
    var totalMinutes = secondsToMinutes(totalSeconds);
    var totalHours = minutesToHours(totalMinutes);
    var totals = {
        'seconds': totalSeconds,
        'minutes': totalMinutes,
        'hours': totalHours
    };
    return totals;
}

function clockFormat(time) {
    return time < 10 ? '0' + time : time;
}

function formTime(milliseconds) {
    total = getTimeTotals(milliseconds);
    var seconds = Math.floor(total.seconds % 60);
    var minutes = Math.floor(total.minutes % 60);
    var hours = Math.floor(total.hours);
    seconds = clockFormat(seconds);
    minutes = clockFormat(minutes);
    var timeObj = {
        'total': milliseconds,
        'seconds': seconds,
        'minutes': minutes,
        'hours': hours
    };
    return timeObj;
}

function updateHtml(timeLeft) {
    times = formTime(timeLeft);
    if (times.hours !== 0) {
        hoursSpan.html(times.hours + ' : ');
    } else {
        hoursSpan.html('');
    }
    if (times.minutes !== 0) {
        minutesSpan.html(times.minutes + ' : ');
        secondsSpan.html(times.seconds);
    } else {
        minutesSpan.html(' ');
        secondsSpan.html(times.seconds + 's');
    }
    if (timerState == 'session') {
        title.html('Session');
    } else {
        title.html('Break');
    }

}

function updateTimer() {
    if (timerState == 'session') {
        endTime -= 1000;
        if (endTime <= 0) {
            clearInterval(timeInterval);
            timerState = 'break';
            setBreak(breakTime);
            startTimer();
        } else {
            updateHtml(endTime);
        }
    }
    if (timerState == 'break') {
        breakEndTime -= 1000;
        if (breakEndTime <= 0) {
            clearInterval(timeInterval);
            timerState = 'session';
            setTimer(sessionTime);
            startTimer();
        } else {
            updateHtml(breakEndTime);
        }
    }
}

function startTimer() {
    clearInterval(timeInterval);
    updateTimer();
    timeInterval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timeInterval);
}

function stopTimer() {
    clearInterval(timeInterval);
    sessionTime = 0;
    breakTime = 0;
}

startButton.click(function() {
    sessionTime = sessionTimeInput.val();
    breakTime = breakTimeInput.val();
    setTimer(sessionTime);
    timerState = 'session';
    startTimer();
});

resetButton.click(function() {
    sessionTime = sessionTimeInput.val();
    breakTime = breakTimeInput.val();
    timerState = 'session';
    stopTimer();
    setTimer(sessionTime);
    updateHtml(endTime);

});