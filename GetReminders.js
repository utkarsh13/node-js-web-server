const EWS = require('node-ews');
const pass = require('./credentials');
const moment = require('moment');

// exchange server connection info
const ewsConfig = {
    username: pass.userpass.user,
    password: pass.userpass.pass,
    host: 'https://sinmail.citrix.com',
    temp:__dirname+'\\WSDL'
};

// initialize node-ews
let ews = new EWS(ewsConfig);

// define ews api function
let ewsFunction = 'GetReminders';

// define ews api function args
let ewsArgs = {
    BeginTime: moment.utc().format(),
    EndTime: moment().endOf('day').format(),
    ReminderType: 'All',
};

const ewsSoapHeader = {
    't:RequestServerVersion': {
        attributes: {
            Version: "Exchange2013"
        }
    }
};

function conv24To12(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
}

function getTextToSay (result) {

    if (result.Reminders === null) {
        return;
        //NO meetings
    }
    // console.log("toSay");
    var obj = result.Reminders.Reminder;
    var finalObj = [];
    var toSay = "";
    for (let i = 0; i < obj.length; i++) {
        if (!obj[i].Subject.includes("Canceled: ")) {
            finalObj.push(obj[i]);
        }
    }
    toSay += `You have ${finalObj.length} meetings today.\n`;
    for (let i = 0; i < finalObj.length; i++) {

        var meetingTime = moment(finalObj[i].StartDate).format().toString().substring(11, 16);
        if (i === 0) {
            toSay += `Your first meeting, ${finalObj[i].Subject} is at ${conv24To12(meetingTime)}.\n`;
        } else if (i === finalObj.length - 1) {
            toSay += `Your last meeting, ${finalObj[i].Subject} is at ${conv24To12(meetingTime)}.\n`;
        } else {
            toSay += `Your next meeting, ${finalObj[i].Subject} is at ${conv24To12(meetingTime)}.\n`;
        }
    }

    // console.log(toSay);
    return toSay;

}

module.exports = {
    getRemindersJson: function() {
        console.log("utkarsh" + "getRemindersJson");
        return ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
            .then((result) => {
                console.log("utkarsh" + JSON.stringify(result));
                return getTextToSay(result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
};