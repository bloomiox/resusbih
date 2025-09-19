// Debug script to test Supabase connection and data
import { supabase } from './lib/supabase.js';

async function debugSupabase() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection error:', testError);
      return;
    }
    
    console.log('✅ Connection successful');
    console.log('📊 Sample course data:', testData[0]);
    
    // Check if registration_enabled column exists
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, registration_enabled');
    
    if (coursesError) {
      console.error('❌ Error fetching courses:', coursesError);
      return;
    }
    
    console.log('📋 Courses with registration_enabled field:');
    courses.forEach(course => {
      console.log(`  - ${course.title}: registration_enabled = ${course.registration_enabled}`);
    });
    
    // Test update operation
    if (courses.length > 0) {
      const firstCourse = courses[0];
      console.log(`\n🔄 Testing update on course: ${firstCourse.title}`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('courses')
        .update({ registration_enabled: !firstCourse.registration_enabled })
        .eq('id', firstCourse.id)
        .select();
      
      if (updateError) {
        console.error('❌ Update error:', updateError);
      } else {
        console.log('✅ Update successful:', updateData[0]);
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugSupabase();