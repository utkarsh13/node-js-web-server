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
const ews = new EWS(ewsConfig);

// define ews api function
const ewsFunction = 'SetUserOofSettings';

// define ews api function args
const ewsArgs = {
    'Mailbox': {
        'Address': pass.userpass.email
    },
    'UserOofSettings': {
        OofState: 'Enabled',
        ExternalAudience: 'All',
        Duration: {
            StartTime: moment().startOf('day').format(),
            EndTime: moment().endOf('day').format()
        },
        InternalReply: {
            Message:'I am out of office today. Contact my manager for anything urgent.'
        },
        ExternalReply: {
            Message:'I am out of office today. Contact my manager for anything urgent.'
        }
    }
};

module.exports = {
    setOof: function() {
        console.log("utkarsh" + "setOof");
        return ews.run(ewsFunction, ewsArgs)
            .then((result) => {
                console.log("utkarsh" + JSON.stringify(result));
                return result;
            })
            .catch((err) => {
                console.log("utkarsh" + err.message);
            });
    }
};