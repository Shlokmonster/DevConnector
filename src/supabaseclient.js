import { createClient } from "@supabase/supabase-js";


const supabaseUrl = "https://rhwmehproorvsztdxtcp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod21laHByb29ydnN6dGR4dGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Mzc3MjcsImV4cCI6MjA2MzUxMzcyN30.S4Rq9PLE6-W65RrVbcESlWwShNJ68QY22mA8TyIWeBI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);