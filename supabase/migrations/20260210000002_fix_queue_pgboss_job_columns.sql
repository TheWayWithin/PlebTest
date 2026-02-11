-- Superseded: intermediate fix, replaced by migration 20260210000004.
-- This migration just drops the broken function from 20260210000001.
DROP FUNCTION IF EXISTS public.queue_pgboss_job(text, jsonb, int, int, text);
