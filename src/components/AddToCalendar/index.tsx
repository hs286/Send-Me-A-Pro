import React from "react";
import { Dropdown } from "react-bootstrap";

const AddToCalendar = () => {
  // function generateGoogleCalendarUrl(calendarEvent: any) {
  //     const encodedUrl = encodeURI([
  //         'https://www.google.com/calendar/render',
  //         '?action=TEMPLATE',
  //         `&text=${calendarEvent.title || ''}`,
  //         `&dates=${calendarEvent.startDate || ''}`,
  //         `/${calendarEvent.endDate || ''}`,
  //         `&details=${`${calendarEvent.description}\n` + `https://cemkiray.com` || ''}`,
  //         `&location=${calendarEvent.address || ''}`,
  //         '&sprop=&sprop=name:'].join(''));

  //     return encodedUrl;
  // }

  // function generateYahooCalendarUrl(calendarEvent: any) {
  //     const encodedUrl = encodeURI([
  //         'http://calendar.yahoo.com/?v=60&view=d&type=20',
  //         `&title=${calendarEvent.title || ''}`,
  //         `&st=${calendarEvent.startDate || ''}`,
  //         `&dur=${calendarEvent.endDate || ''}`,
  //         `&desc=${calendarEvent.description || ''}`,
  //         `&in_loc=${calendarEvent.address || ''}`
  //     ].join(''));

  //     return encodedUrl;
  // }

  // function generateIcsCalendarFile(calendarEvent: any) {
  //     const encodedUrl = encodeURI(
  //         `data:text/calendar;charset=utf8,${[
  //             'BEGIN:VCALENDAR',
  //             'VERSION:2.0',
  //             'BEGIN:VEVENT',
  //             `URL:${document.URL}`,
  //             `DTSTART:${calendarEvent.startDate || ''}`,
  //             `DTEND:${calendarEvent.endDate || ''}`,
  //             `SUMMARY:${calendarEvent.title || ''}`,
  //             `DESCRIPTION:${calendarEvent.description || ''}`,
  //             `LOCATION:${calendarEvent.address || ''}`,
  //             'END:VEVENT',
  //             'END:VCALENDAR'].join('\n')}`);

  //     return encodedUrl;
  // }

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Add to Calendar
      </Dropdown.Toggle>
      {/* <Dropdown.Menu>
            <Dropdown.Item href="#/action-1" role={'button'} onClick={() => {
                const url = generateGoogleCalendarUrl({
                    title: 'Sample Event',
                    description: 'This is the sample event provided as an example only',
                    location: 'Portland, OR',
                    startTime: '2016-09-16T20:15:00-04:00',
                    endTime: '2016-09-16T21:45:00-04:00'
                })
            }}>Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2" role={"button"} onClick={() => {
                const url = generateYahooCalendarUrl({
                    title: 'Sample Event',
                    description: 'This is the sample event provided as an example only',
                    location: 'Portland, OR',
                    startTime: '2016-09-16T20:15:00-04:00',
                    endTime: '2016-09-16T21:45:00-04:00'
                })
                console.log(url);
            }}>Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3" role={"button"} onClick={() => {
                const url = generateIcsCalendarFile({
                    title: 'Sample Event',
                    description: 'This is the sample event provided as an example only',
                    location: 'Portland, OR',
                    startTime: '2016-09-16T20:15:00-04:00',
                    endTime: '2016-09-16T21:45:00-04:00'
                })
                console.log(url);
            }}>Something else</Dropdown.Item>
        </Dropdown.Menu> */}
    </Dropdown>
  );
};

export { AddToCalendar };
