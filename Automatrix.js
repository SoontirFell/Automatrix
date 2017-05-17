/*globals browser, console, SC, YT */
/*jslint plusplus: true */

function convertSeconds(value, units, toSeconds) {
    'use strict';
    if (isNaN(value) = true) {
        console.log('Invalid value for convertSeconds');
        return;
    }
    
    if (!units) {
        console.log('Units undefined for convertSeconds');
        return;
    }
    
    if (!toSeconds ) {
        console.log('toSeconds undefined for convertSeconds');
        return;
    }
    
    if (toSeconds === true) {
        switch (units) {
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

function zeroMarginMultiple(zeroMargin, pairedMargin) {
    'use strict';
    if (parseInt(zeroMargin, 10) === 0 && parseInt(pairedMargin, 10) !== 0) {
        zeroMargin = 1;
    }
    return zeroMargin;
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
    
    timeSavedPerMargin = zeroMarginMultiple(timeSavedPerMargin, taskRepsMargin);
    
    taskRepsMargin = zeroMarginMultiple(taskRepsMargin, timeSavedPerMargin);
    
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
        
        taskFrequencyMargin = zeroMarginMultiple(taskFrequencyMargin, taskDurationMargin);
        
        taskDurationMargin = zeroMarginMultiple(taskDurationMargin, taskFrequencyMargin);
        
        taskRepsMargin = taskFrequencyMargin * taskDurationMargin;
        document.getElementById('taskRepsMargin').value = taskRepsMargin;
    } else {
        document.getElementById('taskRepsMargin').value = null;
    }
    
    calcTimeSaved();
}

function calcTimeSavedPer() {
    'use strict';
    var timeSavedPer,
        timeSavedPerConverted,
        timeSavedPerMargin,
        timeSavedPerUnits,
        timeWOAutomationRaw,
        timeWOAutomationSeconds,
        timeWOAutomationMargin,
        timeWOAutomationUnits,
        timeWAutomationRaw,
        timeWAutomationSeconds,
        timeWAutomationMargin,
        timeWAutomationUnits;
    
    timeWOAutomationRaw = document.getElementById('timeWOAutomation').value;
    timeWOAutomationUnits = document.getElementById('timeWOAutomationUnits').value;
    timeWAutomationRaw = document.getElementById('timeWAutomation').value;
    timeWAutomationUnits = document.getElementById('timeWAutomationUnits').value;
    timeSavedPerUnits = document.getElementById('timeSavedPerUnits').value;
    
    if (!!timeWOAutomationRaw && !!timeWAutomationRaw) {
        timeWOAutomationSeconds = convertSeconds(timeWOAutomationRaw, timeWOAutomationUnits, true);
        
        timeWAutomationSeconds = convertSeconds(timeWAutomationRaw, timeWAutomationUnits, true);
        
        timeSavedPer = parseInt(timeWOAutomationSeconds, 10) - parseInt(timeWAutomationSeconds, 10);
        
        timeSavedPerConverted = convertSeconds(timeSavedPer, timeSavedPerUnits, false);
            
        document.getElementById('timeSavedPer').value = timeSavedPerConverted;
    } else {
        document.getElementById('timeSavedPer').value = null;
    }
    
    timeWOAutomationMargin = document.getElementById('timeWOAutomationMargin').value;
    timeWAutomationMargin = document.getElementById('timeWAutomationMargin').value;
    
    if (!!timeWOAutomationMargin && !!timeWAutomationMargin) {
        console.log('test');
        timeWOAutomationMargin = zeroMarginMultiple(timeWOAutomationMargin, timeWAutomationMargin);
        
        timeWAutomationMargin = zeroMarginMultiple(timeWAutomationMargin, timeWOAutomationMargin);
        
        timeSavedPerMargin = parseInt(timeWOAutomationMargin, 10) + parseInt(timeWAutomationMargin, 10);
        
        document.getElementById('timeSavedPerMargin').value = timeSavedPerMargin;
    } else {
        document.getElementById('timeSavedPerMargin').value = null;
    }
    
    calcTimeSaved();
}

function updateForm(event) {
    'use strict';
    
    switch (event.target.id) {

    case 'timeWAutomation':
    case 'timeWOAutomation':
    case 'timeWAutomationMargin':
    case 'timeWOAutomationMargin':
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
document.getElementById('timeWAutomationUnits').onchange = calcTimeSavedPer;
document.getElementById('timeWOAutomationUnits').onchange = calcTimeSavedPer;
