// Vercel serverless function for Supabase bookings
// This code runs on the server side, so it's safe to use environment variables

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  // Get the data from the request body
  const { nama, whatsapp, items, lama, tanggal, total, type } = request.body;

  // Validate required fields
  if (!nama || !whatsapp || !items || !lama || !tanggal || !total || !type) {
    return response.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Get Supabase credentials from environment variables
    // These are only accessible on the server side
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    // Validate that we have the required environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return response.status(500).json({ message: 'Server configuration error' });
    }

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
      const errorText = await res.text();
      console.error('Supabase error:', errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return response.status(200).json({ message: 'Booking saved successfully' });
  } catch (error) {
    console.error('Error saving booking:', error);
    return response.status(500).json({ message: 'Failed to save booking' });
  }
}