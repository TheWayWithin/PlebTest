-- Superseded: intermediate fix with wrong column names (expire_in instead of expire_seconds).
-- Replaced by migration 20260210000004 which uses verified column names.
-- No-op: function was dropped in 002 and will be recreated correctly in 004.
SELECT 1;
