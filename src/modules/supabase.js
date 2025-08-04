import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayubqgyygwgvsgtetuhc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dWJxZ3l5Z3dndnNndGV0dWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNTQxNzUsImV4cCI6MjA2OTgzMDE3NX0.OmLKkLGN57SkTllk-BW3V-IUtzqM1etxAmk4ffY4IRA'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
