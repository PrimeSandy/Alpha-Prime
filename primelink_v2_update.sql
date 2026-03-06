-- Add Name columns to existing tables
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS participant_1_name text;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS participant_2_name text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_name text;

-- Create an RPC to safely join rooms, bypassing RLS to allow proper full-room detection and logging
CREATE OR REPLACE FUNCTION public.join_room(p_room_code text, p_token text, p_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room record;
BEGIN
  -- Find the room
  SELECT * INTO v_room FROM public.rooms WHERE room_code = p_room_code;
  
  IF v_room IS NULL THEN
    RAISE EXCEPTION 'Invalid Room Code';
  END IF;

  -- Rejoining logic (already a participant)
  IF v_room.participant_1_token = p_token OR v_room.participant_2_token = p_token THEN
    -- Update name just in case it changed
    IF v_room.participant_1_token = p_token THEN
      UPDATE public.rooms SET participant_1_name = p_name WHERE id = v_room.id;
    ELSE
      UPDATE public.rooms SET participant_2_name = p_name WHERE id = v_room.id;
    END IF;
    
    RETURN json_build_object('id', v_room.id, 'room_code', v_room.room_code, 'visual_id', v_room.visual_id);
  END IF;

  -- New joiner, space available
  IF v_room.participant_2_token IS NULL THEN
    UPDATE public.rooms 
    SET participant_2_token = p_token, participant_2_name = p_name, status = 'active' 
    WHERE id = v_room.id;
    
    RETURN json_build_object('id', v_room.id, 'room_code', v_room.room_code, 'visual_id', v_room.visual_id);
  END IF;

  -- Intrusion! Room is completely full and token doesn't match
  INSERT INTO public.security_logs (room_id) VALUES (v_room.id);
  
  -- Throw an exception that contains the room ID so the client can broadcast the alert
  RAISE EXCEPTION 'ROOM_FULL:%', v_room.id;
END;
$$;
