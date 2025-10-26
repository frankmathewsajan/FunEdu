import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://rdvlgslocldmohdswklx.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdmxnc2xvY2xkbW9oZHN3a2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NzA0ODYsImV4cCI6MjA3NzA0NjQ4Nn0.7bdOnGGH0SJ7oHMWo7eMSszSRsbkmLxtjK4swhaO2ns'),
  },
});
