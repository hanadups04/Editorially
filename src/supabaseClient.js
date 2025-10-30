import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pdusaixsvxbquoqkkprr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdXNhaXhzdnhicXVvcWtrcHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDkxMDIsImV4cCI6MjA3NzMyNTEwMn0.PKvki88Su0quqSFWDHQbgpOtwZURq2ExGAvPzUD2Oeo";
export const supabase = createClient(supabaseUrl, supabaseKey);
