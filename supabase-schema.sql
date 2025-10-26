-- ============================================================================
-- FunEdu Database Schema for Supabase
-- ============================================================================
-- This schema creates all necessary tables, policies, and triggers for the
-- FunEdu educational platform with Supabase Authentication
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    class TEXT,
    contact TEXT,
    organization TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    duration_minutes INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    instructor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('active', 'completed', 'dropped')) DEFAULT 'active',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table (for gamification)
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    completed_courses INTEGER DEFAULT 0,
    total_study_time_minutes INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for better query performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON public.courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view all users"
    ON public.users FOR SELECT
    USING (true);

-- Courses policies
CREATE POLICY "Anyone can view courses"
    ON public.courses FOR SELECT
    USING (true);

CREATE POLICY "Instructors can create courses"
    ON public.courses FOR INSERT
    WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update their own courses"
    ON public.courses FOR UPDATE
    USING (auth.uid() = instructor_id);

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
    ON public.enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
    ON public.enrollments FOR UPDATE
    USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements"
    ON public.achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create achievements"
    ON public.achievements FOR INSERT
    WITH CHECK (true);

-- User stats policies
CREATE POLICY "Users can view their own stats"
    ON public.user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
    ON public.user_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for courses table
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_stats table
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, class, contact, organization)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.raw_user_meta_data->>'class',
        NEW.raw_user_meta_data->>'contact',
        NEW.raw_user_meta_data->>'organization'
    );
    
    -- Create initial user stats
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample courses
INSERT INTO public.courses (title, description, category, difficulty, duration_minutes, thumbnail_url)
VALUES 
    ('Introduction to Mathematics', 'Learn the basics of mathematics including algebra and geometry', 'Mathematics', 'beginner', 120, NULL),
    ('Advanced Physics', 'Deep dive into quantum mechanics and relativity', 'Science', 'advanced', 180, NULL),
    ('Creative Writing 101', 'Develop your creative writing skills', 'Language Arts', 'beginner', 90, NULL),
    ('Computer Science Fundamentals', 'Introduction to programming and algorithms', 'Technology', 'intermediate', 150, NULL),
    ('World History', 'Explore major historical events and civilizations', 'History', 'intermediate', 100, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STORAGE BUCKETS (for user avatars and course thumbnails)
-- ============================================================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Create storage bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for course thumbnails
CREATE POLICY "Course thumbnails are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Instructors can upload course thumbnails"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'FunEdu Database Schema Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - users';
    RAISE NOTICE '  - courses';
    RAISE NOTICE '  - enrollments';
    RAISE NOTICE '  - achievements';
    RAISE NOTICE '  - user_stats';
    RAISE NOTICE '';
    RAISE NOTICE 'RLS policies enabled for all tables';
    RAISE NOTICE 'Triggers configured for auto-updates';
    RAISE NOTICE 'Sample data inserted';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is ready to use!';
    RAISE NOTICE '========================================';
END $$;
