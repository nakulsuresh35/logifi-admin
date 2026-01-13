import { createClient } from '@supabase/supabase-js'

// REPLACE THESE WITH YOUR ACTUAL KEYS FROM THE MOBILE APP
const supabaseUrl = 'https://pyoihgqkwtalghcuukcw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5b2loZ3Frd3RhbGdoY3V1a2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTgwNzgsImV4cCI6MjA4MzQ5NDA3OH0.oFMEJfPKClsxV-dIFBkdDHUp_dX--6bK4efjTmqzjdE'

export const supabase = createClient(supabaseUrl, supabaseKey)