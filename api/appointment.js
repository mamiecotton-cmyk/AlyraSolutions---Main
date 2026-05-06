import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const toolCall = req.body?.message?.toolCalls?.[0];
    const args = toolCall?.function?.arguments || {};

    const { callerName, serviceType, preferredDate, preferredTime, callerPhone, notes } = args;

    if (!preferredDate || !preferredTime) {
      return res.status(200).json({ 
        result: "I'm missing the date or time. Could you confirm those again?" 
      });
    }

    const startDateTime = new Date(`${preferredDate}T${preferredTime}:00-07:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const conflictCheck = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startDateTime.toISOString(),
      timeMax: endDateTime.toISOString(),
      singleEvents: true,
    });

    const conflicts = conflictCheck.data.items || [];

    if (conflicts.length > 0) {
      const alternatives = [];
      let checkTime = new Date(startDateTime);
      
      while (alternatives.length < 3) {
        checkTime = new Date(checkTime.getTime() + 30 * 60 * 1000);
        const checkEnd = new Date(checkTime.getTime() + 30 * 60 * 1000);
        
        const altCheck = await calendar.events.list({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          timeMin: checkTime.toISOString(),
          timeMax: checkEnd.toISOString(),
          singleEvents: true,
        });

        if ((altCheck.data.items || []).length === 0) {
          const hours = checkTime.getHours();
          const minutes = checkTime.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
          const displayMin = minutes === 0 ? '00' : minutes;
          alternatives.push(`${displayHour}:${displayMin} ${ampm}`);
        }
      }

      return res.status(200).json({
        result: `I'm sorry — that time slot is already taken. The next available times are ${alternatives[0]}, ${alternatives[1]}, or ${alternatives[2]}. Which works best for you?`
      });
    }

    await fetch('https://hook.us2.make.com/4wti2xfxea2cpodsj1wng1b8exp953im', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callerName,
        serviceType,
        preferredDate,
        preferredTime,
        callerPhone,
        notes: notes || ''
      })
    });

    return res.status(200).json({
      result: `Perfect — you're all set. I've booked your ${serviceType} for ${preferredDate} at ${preferredTime}. Is there anything else I can help you with?`
    });

  } catch (error) {
    console.error('Appointment error:', error);
    return res.status(200).json({
      result: "I'm having trouble booking that right now. Let me transfer you to our team who can help."
    });
  }
}
