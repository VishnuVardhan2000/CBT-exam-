-- ====================================================================
-- MOCK CBT PLATFORM - SBI PO PRELIMINARY DATABASE SCHEMA
-- Compatible with Supabase Postgres, RLS, and Auth Integration
-- ====================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'candidate');
CREATE TYPE exam_stage AS ENUM ('Preliminary', 'Mains');
CREATE TYPE question_subject AS ENUM ('English Language', 'Quantitative Aptitude', 'Reasoning Ability');
CREATE TYPE question_difficulty AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE source_status AS ENUM ('uploaded', 'parsed', 'reviewed');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'expired');

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    target_year INT DEFAULT 2026,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_email UNIQUE (email)
);

-- 3. QUESTION SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.question_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exam_name TEXT NOT NULL DEFAULT 'SBI PO',
    stage exam_stage NOT NULL DEFAULT 'Preliminary',
    file_name TEXT NOT NULL,
    file_url TEXT,
    local_file_path TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    upload_timestamp TIMESTAMPTZ DEFAULT NOW(),
    parsed_count INT DEFAULT 0,
    raw_text TEXT,
    status source_status DEFAULT 'uploaded',
    notes TEXT
);

-- 4. QUESTIONS TABLE (Central Question Bank)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.question_sources(id) ON DELETE SET NULL,
    subject question_subject NOT NULL,
    topic TEXT NOT NULL,
    difficulty question_difficulty DEFAULT 'Medium',
    question_number INT,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    option_e TEXT NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D', 'E')) NOT NULL,
    explanation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast subject, topic & source filtering
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_source ON public.questions(source_id);

-- 5. TESTS TABLE
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    stage exam_stage NOT NULL DEFAULT 'Preliminary',
    total_questions INT NOT NULL DEFAULT 100,
    total_marks NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    total_duration_minutes INT NOT NULL DEFAULT 60,
    negative_marking NUMERIC(3,2) NOT NULL DEFAULT 0.25,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TEST SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.test_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    subject question_subject NOT NULL,
    section_order INT NOT NULL,
    question_count INT NOT NULL,
    marks NUMERIC(5,2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 20,
    CONSTRAINT unique_test_section_order UNIQUE (test_id, section_order)
);

-- 7. TEST SECTION QUESTION MAPPING TABLE
CREATE TABLE IF NOT EXISTS public.test_section_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES public.test_sections(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    position_in_section INT NOT NULL,
    CONSTRAINT unique_section_position UNIQUE (section_id, position_in_section),
    CONSTRAINT unique_section_question UNIQUE (section_id, question_id)
);

-- 8. ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status attempt_status NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    total_score NUMERIC(5,2) DEFAULT 0.00,
    total_correct INT DEFAULT 0,
    total_wrong INT DEFAULT 0,
    total_skipped INT DEFAULT 0,
    accuracy_rate NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_candidate ON public.attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_attempts_test ON public.attempts(test_id);

-- 9. ATTEMPT ANSWERS TABLE (Critical Lock-Once Enforcement)
CREATE TABLE IF NOT EXISTS public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D', 'E')),
    is_correct BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT TRUE, -- Locked upon confirmation
    marks_awarded NUMERIC(4,2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0,
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    -- Strict One Answer Constraint Per Question Per Attempt
    CONSTRAINT unique_attempt_question UNIQUE (attempt_id, question_id)
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_section_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- Helper Function to Check Admin Role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());

-- Questions & Sources Policies (Public read for active, Admin full control)
CREATE POLICY "Candidates can read published questions" ON public.questions FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin manage questions" ON public.questions FOR ALL USING (is_admin());
CREATE POLICY "Admin manage sources" ON public.question_sources FOR ALL USING (is_admin());

-- Tests Policies
CREATE POLICY "Candidates view published tests" ON public.tests FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admin manage tests" ON public.tests FOR ALL USING (is_admin());
CREATE POLICY "Public view sections" ON public.test_sections FOR SELECT USING (true);
CREATE POLICY "Admin manage sections" ON public.test_sections FOR ALL USING (is_admin());

-- Attempts Policies (Candidates own attempts, Admins view all)
CREATE POLICY "Candidates view own attempts" ON public.attempts FOR SELECT USING (candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin());
CREATE POLICY "Candidates create own attempts" ON public.attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Candidates update own attempts" ON public.attempts FOR UPDATE USING (candidate_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR is_admin());

-- Attempt Answers Policies (Strict Lock-once RLS)
CREATE POLICY "Candidates view own answers" ON public.attempt_answers FOR SELECT USING (
    attempt_id IN (
        SELECT id FROM public.attempts WHERE candidate_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        )
    ) OR is_admin()
);

-- INSERT answer allowed only if not already existing (or via engine RPC)
CREATE POLICY "Candidates lock answer" ON public.attempt_answers FOR INSERT WITH CHECK (
    attempt_id IN (
        SELECT id FROM public.attempts WHERE candidate_id IN (
            SELECT id FROM public.profiles WHERE user_id = auth.uid()
        ) AND status = 'in_progress'
    )
);

-- PREVENT UPDATE on locked answers by Candidates
CREATE POLICY "Prevent answer modification if locked" ON public.attempt_answers FOR UPDATE USING (
    is_admin() -- Only admin could update in emergency, candidates NEVER
);
