export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get current date in Pacific Time
  const now = new Date();
  const pacificDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // Build 14-day reference table
  let dateTable = 'DATE REFERENCE TABLE — USE THIS, DO NOT CALCULATE:\n';
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(pacificDate);
    d.setDate(pacificDate.getDate() + i);
    
    const dayName = days[d.getDay()];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();
    const isoDate = `${year}-${String(d.getMonth()+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
    
    const label = i === 0 ? 'today' : i === 1 ? 'tomorrow' : `this ${dayName}`;
    dateTable += `- "${label}" = ${dayName} ${month} ${date} ${year} = ${isoDate}\n`;
  }

  dateTable += '\nAlways look up dates in this table. Never calculate independently.';

  return res.status(200).json({
    assistantOverrides: {
      model: {
        messages: [
          {
            role: 'system',
            content: dateTable
          }
        ]
      }
    }
  });
}
