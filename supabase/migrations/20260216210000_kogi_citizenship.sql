-- Add citizenship and LGA fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_kogite BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lga TEXT;

-- Add citizenship and LGA fields to kogite_locations
-- This helps track anonymous users who verify they are Kogites
ALTER TABLE public.kogite_locations 
  ADD COLUMN IF NOT EXISTS is_kogite BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lga TEXT;

-- Update RLS policies to allow reading these new fields
-- (Already handled by previous 'Anyone can view locations' and 'Profiles viewable by everyone' policies)

-- Add a comment for clarity
COMMENT ON COLUMN public.profiles.is_kogite IS 'Flag to identify if the user is a Kogi State citizen';
COMMENT ON COLUMN public.profiles.lga IS 'Kogi State Local Government Area of origin';
