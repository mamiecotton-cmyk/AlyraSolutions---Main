export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const toolCall = req.body?.message?.toolCalls?.[0];
    const args = toolCall?.function?.arguments || {};

    const response = await fetch('https://hook.us2.make.com/4wti2xfxea2cpodsj1wng1b8exp953im', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callerName: args.callerName,
        serviceType: args.serviceType,
        preferredDate: args.preferredDate,
        preferredTime: args.preferredTime,
        callerPhone: args.callerPhone,
        notes: args.notes || ''
      })
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
