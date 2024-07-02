import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.REACT_APP_SUPABASE_ANON_KEY;
const REACT_APP_SUPABASE_URL="https://fuhwsgyrsengfjikqprp.supabase.co"
const REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aHdzZ3lyc2VuZ2ZqaWtxcHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0MTM4NzEsImV4cCI6MjAzNDk4OTg3MX0.XRcGSSjYwZBiMNbf2KtxAc1vLjxLbGQLnt5ahaoEKZQ"

const supabaseUrl = REACT_APP_SUPABASE_URL;
const supabaseAnonKey = REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;