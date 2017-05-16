/*globals browser, console, SC, YT */
/*jslint plusplus: true */

function convertSeconds(value, units, toSeconds) {
    'use strict';
    
    if (toSeconds === true) {
        switch (units) {
        case 'Seconds':
            break;
        case 'Minutes':
            value = value * 60;
            break;
        case 'Hours':
            value = value * 3600;
            break;
        case 'Days':
            value = value * 86400;
            break;
        case 'Weeks':
            value = value * 604800;
            break;
        case 'Years':
            value = value * 31536000;
            break;
        }
    }
    
    if (toSeconds === false) {
        switch (units) {
        case 'Seconds':
            break;
        case 'Minutes':
            value = value / 60;
            break;
        case 'Hours':
            value = value / 3600;
            break;
        case 'Days':
            value = value / 86400;
            break;
        case 'Weeks':
            value = value / 604800;
            break;
        case 'Years':
            value = value / 31536000;
            break;
        }
    }
    
    return value;
    
}

function calcBreakEven(timeSavedPerSeconds, timeSavedPerMagin, taskReps, setupTimeSeconds, setupTimeMargin) {
    'use strict';
    var breakEvenRepsAvg,
        breakEvenRepsMargin,
        breakEvenRepsFinal;
    
    breakEvenRepsAvg = setupTimeSeconds / timeSavedPerSeconds;
    breakEvenRepsMargin = timeSavedPerMagin + setupTimeMargin;
    
    if (isNaN(breakEvenRepsMargin) === true || breakEvenRepsMargin <= 0) {
        breakEvenRepsFinal = breakEvenRepsAvg;
    } else {
        breakEvenRepsFinal = breakEvenRepsAvg + ' (' + (breakEvenRepsAvg * (100 - breakEvenRepsMargin) / 100)  + ' - ' + (breakEvenRepsAvg * (100 + breakEvenRepsMargin) / 100)  + ')';
    }
    
    document.getElementById('breakEvenReps').value = breakEvenRepsFinal;
}

function calcTimeSaved() {
    'use strict';
    var timeSavedPerRaw,
        timeSavedPerMargin,
        timeSavedPerUnits,
        timeSavedPerSeconds,
        taskReps,
        taskRepsMargin,
        setupTimeRaw,
        setupTimeMargin,
        setupTimeUnits,
        setupTimeSeconds,
        timeSavedMargin,
        timeSavedUnits,
        timeSavedSeconds,
        timeSavedConverted,
        timeSavedFinal;
    
    timeSavedPerRaw = parseInt(document.getElementById('timeSavedPer').value, 10);
    timeSavedPerMargin = parseInt(document.getElementById('timeSavedPerMargin').value, 10);
    timeSavedPerUnits = document.getElementById('timeSavedPerUnits').value;
    
    if (timeSavedPerUnits === 'Seconds') {
        timeSavedPerSeconds = timeSavedPerRaw;
    } else {
        timeSavedPerSeconds = convertSeconds(timeSavedPerRaw, timeSavedPerUnits, true);
    }
    
    
    taskReps = parseInt(document.getElementById('taskReps').value, 10);
    taskRepsMargin = parseInt(document.getElementById('taskRepsMargin').value, 10);
    
    setupTimeRaw = parseInt(document.getElementById('setupTime').value, 10);
    setupTimeMargin = parseInt(document.getElementById('setupTimeMargin').value, 10);
    setupTimeUnits = document.getElementById('setupTimeUnits').value;
    
    if (setupTimeUnits === 'Seconds') {
        setupTimeSeconds = setupTimeRaw;
    } else {
        setupTimeSeconds = convertSeconds(setupTimeRaw, setupTimeUnits, true);
    }
    
    
    timeSavedUnits = document.getElementById('timeSavedUnits').value;
    timeSavedSeconds = (timeSavedPerSeconds * taskReps) - setupTimeSeconds;
    
    if (timeSavedUnits === 'Seconds') {
        timeSavedConverted = timeSavedSeconds;
    } else {
        timeSavedConverted = convertSeconds(timeSavedSeconds, timeSavedUnits, false);
    }
    
    if (parseInt(timeSavedPerMargin, 10) === 0 && parseInt(taskRepsMargin, 10) !== 0) {
        timeSavedPerMargin = 1;
    }
    
    if (parseInt(taskRepsMargin, 10) === 0 && parseInt(timeSavedPerMargin, 10) !== 0) {
        taskRepsMargin = 1;
    }
    
    
    timeSavedMargin = (timeSavedPerMargin * taskRepsMargin) + setupTimeMargin;
    
    if (isNaN(timeSavedMargin) === false) {
        document.getElementById('timeSavedMargin').value = timeSavedMargin;
    } else {
        document.getElementById('timeSavedMargin').value = null;
    }
    
    if (isNaN(timeSavedConverted) === false) {
        if (isNaN(timeSavedMargin) === true) {
            timeSavedFinal = timeSavedConverted;
        } else {
            timeSavedFinal = timeSavedConverted + ' (' + (timeSavedConverted * (100 - timeSavedMargin) / 100)  + ' - ' + (timeSavedConverted * (100 + timeSavedMargin) / 100)  + ')';
        }
        document.getElementById('timeSaved').value = timeSavedFinal;
        
        if (timeSavedConverted >= 0) {
            calcBreakEven(timeSavedPerSeconds, timeSavedPerMargin, taskReps, setupTimeSeconds, setupTimeMargin);
        } else {
            document.getElementById('breakEvenReps').value = '';
            document.getElementById('breakEvenTime').value = '';
            document.getElementById('surplusTime').value = '';
        }
    } else {
        document.getElementById('timeSaved').value = '';
    }
}

function calcTaskReps() {
    'use strict';
    var taskReps,
        taskRepsMargin,
        taskFrequencyRaw,
        taskFrequencyConverted,
        taskFrequencyMargin,
        taskFrequencyUnits,
        taskDurationRaw,
        taskDurationConverted,
        taskDurationMargin,
        taskDurationUnits;
    
    taskFrequencyRaw = document.getElementById('taskFrequency').value;
    taskFrequencyUnits = document.getElementById('taskFrequencyUnits').value;
    taskDurationRaw = document.getElementById('taskDuration').value;
    taskDurationUnits = document.getElementById('taskDurationUnits').value;
    
    if (!!taskFrequencyRaw && !!taskDurationRaw) {
        taskFrequencyConverted = convertSeconds(taskFrequencyRaw, taskFrequencyUnits + 's', false);
        taskDurationConverted = convertSeconds(taskDurationRaw, taskDurationUnits, true);
        taskReps = taskFrequencyConverted * taskDurationConverted;
        document.getElementById('taskReps').value = taskReps;
    } else {
        document.getElementById('taskReps').value = null;
    }
    
    taskFrequencyMargin = document.getElementById('taskFrequencyMargin').value;
    taskDurationMargin = document.getElementById('taskDurationMargin').value;
    
    if (!!taskFrequencyMargin && !!taskDurationMargin) {
        
        if (parseInt(taskFrequencyMargin, 10) === 0 && parseInt(taskDurationMargin, 10) !== 0) {
            taskFrequencyMargin = 1;
        }
        
        if (parseInt(taskDurationMargin, 10) === 0 && parseInt(taskFrequencyMargin, 10) !== 0) {
            taskDurationMargin = 1;
        }
        
        taskRepsMargin = taskFrequencyMargin * taskDurationMargin;
        document.getElementById('taskRepsMargin').value = taskRepsMargin;
    } else {
        document.getElementById('taskRepsMargin').value = null;
    }
    
    calcTimeSaved();
}

function calcTimeSavedPer() {
    'use strict';
    
    calcTimeSaved();
}

function updateForm(event) {
    'use strict';
    
    switch (event.target.id) {

    case 'timeWAutomation':
    case 'timeWOAutomation':
        calcTimeSavedPer();
        break;
        
    case 'taskFrequency':
    case 'taskDuration':
    case 'taskFrequencyMargin':
    case 'taskDurationMargin':
        calcTaskReps();
        break;

    default:
        calcTimeSaved();
        break;
    }
}

document.addEventListener('keyup', updateForm);
document.getElementById('timeSavedUnits').onchange = updateForm;
document.getElementById('timeSavedPerUnits').onchange = updateForm;
document.getElementById('setupTimeUnits').onchange = updateForm;
document.getElementById('taskFrequencyUnits').onchange = calcTaskReps;
document.getElementById('taskDurationUnits').onchange = calcTaskReps;
document.getElementById('timeWAutomationUnits').onchange = updateForm;
document.getElementById('timeWOAutomationUnits').onchange = updateForm;