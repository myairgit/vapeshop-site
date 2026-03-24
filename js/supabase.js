import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://dayqnqpeopbfpcowzwlv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheXFucXBlb3BiZnBjb3d6d2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDQyNDksImV4cCI6MjA4OTE4MDI0OX0.YCp_zMyXtUUWiA8iomAzGG9y3-oYWJaOj1V_1mcKq9w"

export const supabase = createClient(supabaseUrl, supabaseKey)