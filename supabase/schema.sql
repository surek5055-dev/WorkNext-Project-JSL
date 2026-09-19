-- WorkNext Supabase Schema: Mentors & Access Control
-- Run this in your Supabase SQL Editor to provision the production mentors table with Row Level Security (RLS)

-- 1. Create mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  hourly_rate TEXT,
  availability TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rating NUMERIC(3,2),
  review_count INT,
  sessions_completed INT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_mentors_status ON public.mentors(status);
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_specialties ON public.mentors USING GIN(specialties);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- 4. Access Control Policies

-- Rule 1: Anyone (public or authenticated) can view APPROVED mentors
CREATE POLICY "Public can view approved mentors"
  ON public.mentors
  FOR SELECT
  USING (status = 'approved');

-- Rule 2: Authenticated users can view their OWN mentor profile (even if pending or rejected)
CREATE POLICY "Users can view their own mentor profile"
  ON public.mentors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Rule 3: Authenticated users can register a mentor profile with status 'pending'
CREATE POLICY "Users can register their own mentor profile"
  ON public.mentors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    status = 'pending'
  );

-- Rule 4: Mentors can update their own profile (cannot unilaterally self-approve status)
CREATE POLICY "Mentors can update own profile"
  ON public.mentors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
  );

-- Rule 5: Administrators can view all mentor records (pending, approved, rejected)
CREATE POLICY "Admins can view all mentors"
  ON public.mentors
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- Rule 6: Administrators can update mentor status (approve/reject/pending)
CREATE POLICY "Admins can update mentor status"
  ON public.mentors
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin') OR
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

-- 5. Helper function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_mentors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_mentors_updated_at ON public.mentors;
CREATE TRIGGER set_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_mentors_updated_at();
