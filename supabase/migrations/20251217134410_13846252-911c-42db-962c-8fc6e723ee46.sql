-- Update the handle_new_user function to add input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _full_name text;
BEGIN
  -- Extract and validate full_name from user metadata
  -- Limit to 100 characters to prevent excessively long names
  -- Use COALESCE to handle null values gracefully
  _full_name := COALESCE(
    LEFT(TRIM(new.raw_user_meta_data ->> 'full_name'), 100),
    ''
  );
  
  -- Only insert non-empty values, otherwise leave full_name as NULL
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    NULLIF(_full_name, '')
  );
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail user creation
    -- The profile can be created later if this fails
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;