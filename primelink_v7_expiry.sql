-- =============================================
-- PrimeLink V7 SQL: 30-Day Auto-Expiry + Invite Flow
-- Run in Supabase SQL Editor
-- =============================================

-- 1. Add last_active_at to track when a room was last used
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- 2. Update last_active_at whenever a message is inserted (trigger)
CREATE OR REPLACE FUNCTION public.update_room_last_active()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.rooms SET last_active_at = now() WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
CREATE TRIGGER on_message_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_room_last_active();

-- 3. Function to delete rooms inactive for 30+ days (call via pg_cron or manually)
CREATE OR REPLACE FUNCTION public.cleanup_expired_rooms()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.rooms
  WHERE last_active_at < now() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_rooms() TO anon, authenticated;

-- 4. (Optional) If you have pg_cron enabled in Supabase, schedule this:
-- SELECT cron.schedule('cleanup-old-primelink-rooms', '0 3 * * *', 'SELECT public.cleanup_expired_rooms();');
-- =============================================
