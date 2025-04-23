const { v4: uuidv4 } = require('uuid');

const formatDate = (date) => {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

function generateICalEvent(event) {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uuidv4()}@${process.env.DOMAIN || 'stagholme.com'}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location}
ORGANIZER;CN=${event.organizer?.name || 'Event Organizer'}:mailto:${event.organizer?.email || process.env.EMAIL_FROM}
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${event.to.name || event.to.email}:mailto:${event.to.email}
END:VEVENT
END:VCALENDAR`;
}

module.exports = {
  generateICalEvent,
  formatDate
};