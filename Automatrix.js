/*globals browser, console, SC, YT */
/*jslint plusplus: true */

// Converts time values to and from Seconds. Can be used in the opposite direction if the value is per time, e.g. 1 task per hour
function convertSeconds(value, units, bToSeconds) {
    'use strict';
    var conversionMap = {
        'Seconds': 1,
        'Minutes': 60,
        'Hours': 3600,
        'Days': 86400,
        'Weeks': 604800,
        'Years': 31536000
    };
    if (typeof value !== 'undefined' && typeof units !== 'undefined' && typeof bToSeconds !== 'undefined') {
        if (!!conversionMap[units]) {
            if (bToSeconds) {
                return value * conversionMap[units];
            }
            if (!bToSeconds) {
                return value / conversionMap[units];
            }
        } else {
            console.log('ERROR: convertSeconds - invalid units');
        }
    } else {
        console.log('ERROR: convertSeconds - expects (value, units, bToSeconds)');
    }
}

// Ensures that a 0% margin of error does not result in a separate, non-zero margin of error being nullified.
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
    
    setupTimeSeconds = setupTimeRaw;
    if (setupTimeUnits !== 'Seconds') {
        setupTimeSeconds = convertSeconds(setupTimeSeconds, setupTimeUnits, true);
    }
    
    timeSavedUnits = document.getElementById('timeSavedUnits').value;
    timeSavedSeconds = (timeSavedPerSeconds * taskReps) - setupTimeSeconds;
    
    timeSavedConverted = timeSavedSeconds;
    if (timeSavedUnits !== 'Seconds') {
        timeSavedConverted = convertSeconds(timeSavedConverted, timeSavedUnits, false);
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
document.getElementById('timeSavedUnits').addEventListener('input', updateForm);
document.getElementById('timeSavedPerUnits').addEventListener('input', updateForm);
document.getElementById('setupTimeUnits').addEventListener('input', updateForm);
document.getElementById('taskFrequencyUnits').addEventListener('input', calcTaskReps);
document.getElementById('taskDurationUnits').addEventListener('input', calcTaskReps);
document.getElementById('timeWAutomationUnits').addEventListener('input', calcTimeSavedPer);
document.getElementById('timeWOAutomationUnits').addEventListener('input', calcTimeSavedPer);