// Debug utility for authentication issues
export const debugAuth = () => {
  console.log('=== Auth Debug Info ===');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Supabase Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
  console.log('Environment:', import.meta.env.VITE_NODE_ENV);
  
  // Test Supabase connection
  import('../lib/supabase').then(({ supabase }) => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Current session:', data.session ? 'Active' : 'None');
      if (error) console.error('Session error:', error);
    });
  });
};

// Call this in development to debug auth issues
if (import.meta.env.VITE_NODE_ENV === 'development') {
  (window as any).debugAuth = debugAuth;
}