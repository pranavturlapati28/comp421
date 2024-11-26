import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient("https://rdhvdycsucjiolrsemle.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHZkeWNzdWNqaW9scnNlbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1Nzg2MzgsImV4cCI6MjA0ODE1NDYzOH0.rElSCYLsURQW-9Gb4a_aTXGUmGJlKqXfcws3oo-XXjE");