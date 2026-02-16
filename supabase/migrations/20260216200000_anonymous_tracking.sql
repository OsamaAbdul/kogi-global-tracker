-- Make user_id nullable for anonymous tracking
ALTER TABLE public.kogite_locations ALTER COLUMN user_id DROP NOT NULL;

-- Ensure kogite_locations references public.profiles(user_id) for easier joining
ALTER TABLE public.kogite_locations DROP CONSTRAINT IF EXISTS kogite_locations_user_id_fkey;
ALTER TABLE public.kogite_locations DROP CONSTRAINT IF EXISTS kogite_locations_profiles_user_id_fkey;
ALTER TABLE public.kogite_locations 
  ADD CONSTRAINT kogite_locations_profiles_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add anonymous_id for guest tracking (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kogite_locations' AND column_name='anonymous_id') THEN
        ALTER TABLE public.kogite_locations ADD COLUMN anonymous_id UUID;
    END IF;
END $$;

-- Add unique constraint on anonymous_id (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kogite_locations_anonymous_id_key') THEN
        ALTER TABLE public.kogite_locations ADD CONSTRAINT kogite_locations_anonymous_id_key UNIQUE (anonymous_id);
    END IF;
END $$;

-- Add flat latitude and longitude columns for easier frontend consumption
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kogite_locations' AND column_name='latitude') THEN
        ALTER TABLE public.kogite_locations ADD COLUMN latitude NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='kogite_locations' AND column_name='longitude') THEN
        ALTER TABLE public.kogite_locations ADD COLUMN longitude NUMERIC;
    END IF;
END $$;

-- Update RLS policies for public access (anon role)
DROP POLICY IF EXISTS "Anyone can view locations" ON public.kogite_locations;
CREATE POLICY "Anyone can view locations"
  ON public.kogite_locations FOR SELECT
  USING (true);

-- Allow anonymous users to insert their own location
DROP POLICY IF EXISTS "Anyone can insert own location" ON public.kogite_locations;
CREATE POLICY "Anyone can insert own location"
  ON public.kogite_locations FOR INSERT
  WITH CHECK (
    (auth.role() = 'authenticated' AND auth.uid() = user_id) OR
    (auth.role() = 'anon')
  );

-- Allow anonymous users to update their own location via anonymous_id
DROP POLICY IF EXISTS "Anyone can update own location" ON public.kogite_locations;
CREATE POLICY "Anyone can update own location"
  ON public.kogite_locations FOR UPDATE
  USING (
    (auth.role() = 'authenticated' AND auth.uid() = user_id) OR
    (auth.role() = 'anon' AND anonymous_id IS NOT NULL)
  );

-- Allow public access to profiles (needed for public map display names)
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);
