-- Create a function to queue pg-boss jobs from the web server.
-- This avoids needing to start a full pg-boss instance (which opens
-- additional DB connections that can exhaust Supabase free tier limits).
-- The function is SECURITY DEFINER so it can access the pgboss schema.

CREATE OR REPLACE FUNCTION public.queue_pgboss_job(
  job_name text,
  job_data jsonb,
  retry_limit int DEFAULT 3,
  expire_minutes int DEFAULT 15,
  singleton_key text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  job_id uuid;
  existing_id uuid;
BEGIN
  -- If singleton_key is provided, check for existing active job
  IF singleton_key IS NOT NULL THEN
    SELECT id INTO existing_id
    FROM pgboss.job
    WHERE name = job_name
      AND singletonkey = singleton_key
      AND state IN ('created', 'retry', 'active')
    LIMIT 1;

    IF existing_id IS NOT NULL THEN
      RETURN NULL; -- Job already exists, skip
    END IF;
  END IF;

  -- Insert new job
  INSERT INTO pgboss.job (
    name,
    data,
    retrylimit,
    retrydelay,
    retrybackoff,
    expirein,
    retentionminutes,
    startafter,
    state,
    singletonkey
  )
  VALUES (
    job_name,
    job_data,
    retry_limit,
    1, -- 1 second retry delay
    true, -- exponential backoff
    make_interval(mins => expire_minutes),
    10080, -- 7 days retention
    now(),
    'created',
    singleton_key
  )
  RETURNING id INTO job_id;

  RETURN job_id;
END;
$$;

-- Grant execute to authenticated users (they still need to pass auth checks in the API route)
GRANT EXECUTE ON FUNCTION public.queue_pgboss_job TO authenticated;
GRANT EXECUTE ON FUNCTION public.queue_pgboss_job TO service_role;
