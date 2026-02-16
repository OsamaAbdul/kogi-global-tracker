
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create kogite_locations table
CREATE TABLE public.kogite_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_name TEXT,
  coords GEOGRAPHY(Point, 4326),
  is_active BOOLEAN DEFAULT true,
  ghost_mode BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.kogite_locations ENABLE ROW LEVEL SECURITY;

-- Users can read all locations (for the map)
CREATE POLICY "Anyone authenticated can view locations"
  ON public.kogite_locations FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own location
CREATE POLICY "Users can insert own location"
  ON public.kogite_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own location
CREATE POLICY "Users can update own location"
  ON public.kogite_locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own location
CREATE POLICY "Users can delete own location"
  ON public.kogite_locations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, is_kogite, lga)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    (NEW.raw_user_meta_data->>'is_kogite')::boolean,
    NEW.raw_user_meta_data->>'lga'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for kogite_locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.kogite_locations;
