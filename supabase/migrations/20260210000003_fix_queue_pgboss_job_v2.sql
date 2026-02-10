-- Fix queue_pgboss_job function for pg-boss v10+ which uses snake_case column names.
-- Previous version used camelCase (singletonkey, retrylimit, etc.) which don't exist in v10+.

-- Drop the old function (has original parameter names)
DROP FUNCTION IF EXISTS public.queue_pgboss_job(text, jsonb, int, int, text);

-- Recreate with correct column names and disambiguated parameters
CREATE FUNCTION public.queue_pgboss_job(
  job_name text,
  job_data jsonb,
  retry_limit int DEFAULT 3,
  expire_minutes int DEFAULT 15,
  p_singleton_key text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_job_id uuid;
  v_existing_id uuid;
BEGIN
  -- If singleton_key is provided, check for existing active job
  IF p_singleton_key IS NOT NULL THEN
    SELECT id INTO v_existing_id
    FROM pgboss.job j
    WHERE j.name = job_name
      AND j.singleton_key = p_singleton_key
      AND j.state IN ('created', 'retry', 'active')
    LIMIT 1;

    IF v_existing_id IS NOT NULL THEN
      RETURN NULL; -- Job already exists, skip
    END IF;
  END IF;

  -- Insert new job (pg-boss v10+ uses snake_case column names)
  INSERT INTO pgboss.job (
    name,
    data,
    retry_limit,
    retry_delay,
    retry_backoff,
    expire_in,
    retention_minutes,
    start_after,
    state,
    singleton_key
  )
  VALUES (
    queue_pgboss_job.job_name,
    queue_pgboss_job.job_data,
    queue_pgboss_job.retry_limit,
    1,
    true,
    make_interval(mins => expire_minutes),
    10080,
    now(),
    'created',
    p_singleton_key
  )
  RETURNING id INTO v_job_id;

  RETURN v_job_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.queue_pgboss_job TO authenticated;
GRANT EXECUTE ON FUNCTION public.queue_pgboss_job TO service_role;
