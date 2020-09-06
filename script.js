var time;
var plan;
var save;
var schedule = [];
var workTimes = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

var currentHour = moment().format('hA');
var pastHour = moment().subtract(1, 'hours').format('hA');
var currentHourIndex = workTimes.indexOf(currentHour);
var currentDay = $("#currentDay").text(moment().format('dddd Do MMMM, h:mm a')); // Friday 4th September, 5:53 pm
if (currentHourIndex === -1) {
    currentDay.append("<br><br>" + "(Outside Business Hours)");
}

// append timeBlocks
for (var i = 0; i < 9; i++) {
    addTimeBlock();
    time.text(workTimes[i]);
    save.attr('id', 'time-' + workTimes[i]);
    plan.addClass(workTimes[i]);
}

// load page at current hour
if (currentHourIndex > -1) {
    window.location.hash = "#time-" + currentHour;
}

getSchedule();

//grey, red, green
setInterval(function() {
    // if in business hours then set present
    if (currentHourIndex > -1) {
        $("." + currentHour).removeClass("future past").addClass("present");

        // if in the past set grey
        workTimes.forEach(element => {
            if (workTimes.indexOf(element) < currentHourIndex) {
                $("." + element).removeClass("present future").addClass("past");
            }
        });
    }
    
    // if new day set green
    if (currentHourIndex === -1) {
        $("description").removeClass("past present").addClass("future");
    }
}, 1000) //refreshes every sec


$(".saveBtn").on("click", (event) => {
    var userTime = event.currentTarget.previousElementSibling.className.split(" ")[3];
    var userDescription = event.currentTarget.previousElementSibling.value.trim();

    if (userDescription === "") {
        return;
    } else {
        // if usertime already exists then just change the description
        if ( (schedule.find( (element) => element.userTime === userTime)) === undefined) {
            schedule.push({userTime, userDescription});
        } else {
            var element = schedule.find( (element) => element.userTime === userTime )
            element.userDescription = userDescription;
        }
    }

    // save the schedule to local storage
    localStorage.setItem("schedule", JSON.stringify(schedule));
})

function getSchedule() {
    //get stored items
    var storedSchedule = JSON.parse(localStorage.getItem("schedule"));

    if (storedSchedule !== null) {
        schedule = storedSchedule; // update schedule from local storage
    }

    // load schedule into time blocks
    schedule.forEach(element => {
        $("." + element.userTime).text(element.userDescription);
    });
}

function addTimeBlock() {
    var timeBlock = $("<div>").addClass("time-block row .no-gutters");

    time = $("<div>").addClass("hour col");
    timeBlock.append(time);

    plan = $("<textarea>").addClass("description future col-10");
    timeBlock.append(plan);

    save = $("<button>").addClass("saveBtn col");
    save.append($("<i>").addClass("fas fa-save"));
    timeBlock.append(save);

    $(".container").append(timeBlock);
}