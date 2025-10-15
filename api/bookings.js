// Vercel serverless function for Supabase bookings
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  const { nama, whatsapp, items, lama, tanggal, total, type } = request.body;

  try {
    // Send data to Supabase
    const res = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        nama,
        whatsapp,
        items,
        lama: parseInt(lama),
        tanggal,
        total: parseInt(total),
        type
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return response.status(200).json({ message: 'Booking saved successfully' });
  } catch (error) {
    console.error('Error saving booking:', error);
    return response.status(500).json({ message: 'Failed to save booking' });
  }
}