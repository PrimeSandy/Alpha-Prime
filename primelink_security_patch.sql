-- =============================================
-- PrimeLink V3 Security Patch
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Fix the join_room RPC with FOR UPDATE row lock to prevent race conditions
CREATE OR REPLACE FUNCTION public.join_room(p_room_code text, p_token text, p_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room record;
BEGIN
  -- Find and LOCK the room row to prevent two concurrent joins from both seeing "slot available"
  SELECT * INTO v_room 
  FROM public.rooms 
  WHERE room_code = p_room_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVALID_CODE: No room with that code exists.';
  END IF;

  -- Rejoining logic: if the person is already participant 1 or 2, let them back in
  IF v_room.participant_1_token = p_token OR v_room.participant_2_token = p_token THEN
    -- Update their display name in case it changed
    IF v_room.participant_1_token = p_token THEN
      UPDATE public.rooms SET participant_1_name = p_name WHERE id = v_room.id;
    ELSE
      UPDATE public.rooms SET participant_2_name = p_name WHERE id = v_room.id;
    END IF;
    RETURN json_build_object('id', v_room.id, 'room_code', v_room.room_code, 'visual_id', v_room.visual_id);
  END IF;

  -- New joiner: check if there is an open slot
  IF v_room.participant_2_token IS NULL THEN
    UPDATE public.rooms 
    SET participant_2_token = p_token, participant_2_name = p_name, status = 'active' 
    WHERE id = v_room.id;

    RETURN json_build_object('id', v_room.id, 'room_code', v_room.room_code, 'visual_id', v_room.visual_id);
  END IF;

  -- Room is FULL and this person is not a participant — log the intrusion
  INSERT INTO public.security_logs (room_id) VALUES (v_room.id);
  
  -- Return the room_id inside the exception message so the client can broadcast the alert
  RAISE EXCEPTION 'ROOM_FULL:%', v_room.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_room(text, text, text) TO anon, authenticated;
