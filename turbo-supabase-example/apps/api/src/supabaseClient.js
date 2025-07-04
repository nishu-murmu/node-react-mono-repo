import { createClient } from '@supabase/supabase-js';

// These variables are expected to be loaded by `dotenv` in development (see package.json script)
// or set directly in the production environment.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Error: SUPABASE_URL is not defined. Make sure it's set in your .env file or environment variables.");
  // process.exit(1); // Optionally exit if not defined, depending on desired strictness
}
if (!supabaseAnonKey) {
  console.error("Error: SUPABASE_ANON_KEY is not defined. Make sure it's set in your .env file or environment variables.");
  // process.exit(1);
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  console.error("Supabase client could not be initialized. Check your SUPABASE_URL and SUPABASE_ANON_KEY.");
}
