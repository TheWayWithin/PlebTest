-- Fix queue_pgboss_job function for pg-boss v10+ which uses snake_case column names.
-- Previous version used camelCase (singletonkey, retrylimit, etc.) which don't exist in v10+.
-- Also fixes parameter/column name ambiguity by prefixing parameters with p_.

CREATE OR REPLACE FUNCTION public.queue_pgboss_job(
  p_job_name text,
  p_job_data jsonb,
  p_retry_limit int DEFAULT 3,
  p_expire_minutes int DEFAULT 15,
  p_singleton_key text DEFAULT NULL
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
  IF p_singleton_key IS NOT NULL THEN
    SELECT id INTO existing_id
    FROM pgboss.job
    WHERE name = p_job_name
      AND singleton_key = p_singleton_key
      AND state IN ('created', 'retry', 'active')
    LIMIT 1;

    IF existing_id IS NOT NULL THEN
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
    p_job_name,
    p_job_data,
    p_retry_limit,
    1, -- 1 second retry delay
    true, -- exponential backoff
    make_interval(mins => p_expire_minutes),
    10080, -- 7 days retention
    now(),
    'created',
    p_singleton_key
  )
  RETURNING id INTO job_id;

  RETURN job_id;
END;
$$;
