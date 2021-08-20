const req = {body: null, headers: null};
const targetUrl = 'https://www.coursera.org/api/grpc/degreehome/v1beta1/DegreeHomeCalendarAPI/GetDegreeHomeCalendar';
let sent = false;

const processGrades = data => {
    const grades = [];
    for (const item of data.calendarItems) {
        if (!item.assignment || !item.assignment.grade || item.assignment.assignmentType !== 'staffGraded') {
            continue;
        }
        grades.push(item.assignment);
    }
    chrome.tabs.executeScript(
        null,
        {code: `const grades = ${JSON.stringify(grades)};`},
        () => {
            chrome.tabs.executeScript(null, {file: 'inject.js'});
        }
    );
};

const convertHeaders = arr => {
    const headers = [];
    for (const obj of arr) {
        headers.push([obj.name, obj.value]);
    }
    return new Headers(headers);
};

const resendRequest = () => {
    // The webRequest API does not provide a response body reader, so here the request
    // is resent using the same request body and headers
    fetch(targetUrl, {
        method: 'POST',
        headers: req.headers,
        body: req.body
    })
    .then(resp => resp.json())
    .then(data => {
        processGrades(data);
        sent = false;
    })
    .catch(() => {
        sent = false;
    });
};

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        req.body = details.requestBody.raw[0].bytes;
    },
    {urls: [targetUrl]},
    ['requestBody']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
        req.headers = convertHeaders(details.requestHeaders);
        if (!sent) {
            sent = true;
            resendRequest();
        }
    },
    {urls: [targetUrl]},
    ['requestHeaders']
);
