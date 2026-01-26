/**
 * Cron Jobs Worker
 *
 * Sets up scheduled background jobs for maintenance tasks.
 */

import { getBoss, JobTypes } from '../src/lib/jobs';
import { createAdminClient } from '../src/lib/supabase/admin';

/**
 * Set up all cron jobs.
 */
export async function setupCronJobs(): Promise<void> {
  const boss = await getBoss();

  // =========================================
  // Session Timeout Check - Every 5 minutes
  // =========================================
  // Create queue explicitly (required in pg-boss v10+)
  await boss.createQueue(JobTypes.CHECK_SESSION_TIMEOUT);

  // Register worker, then schedule
  await boss.work(JobTypes.CHECK_SESSION_TIMEOUT, async () => {
    console.log(`[${JobTypes.CHECK_SESSION_TIMEOUT}] Checking for expired sessions...`);

    const supabase = createAdminClient();

    // Sessions expire after 30 minutes of inactivity
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: expiredSessions, error } = await supabase
      .from('sessions')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('last_activity_at', thirtyMinutesAgo)
      .select('id');

    if (error) {
      console.error(`[${JobTypes.CHECK_SESSION_TIMEOUT}] Error:`, error);
      throw error;
    }

    const count = expiredSessions?.length || 0;
    if (count > 0) {
      console.log(`[${JobTypes.CHECK_SESSION_TIMEOUT}] Expired ${count} sessions`);
    }

    return { expiredCount: count };
  });

  // Now schedule after queue is created by work()
  await boss.schedule(
    JobTypes.CHECK_SESSION_TIMEOUT,
    '*/5 * * * *', // Every 5 minutes
    {}
  );

  // =========================================
  // Trial Reminder - Daily at 9am UTC
  // =========================================
  // Note: Disabled for MVP, uncomment when email system is ready
  /*
  await boss.schedule(
    JobTypes.TRIAL_REMINDER,
    '0 9 * * *', // Daily at 9am UTC
    {}
  );

  await boss.work(JobTypes.TRIAL_REMINDER, async () => {
    console.log(`[${JobTypes.TRIAL_REMINDER}] Checking for trial reminders...`);

    const supabase = createAdminClient();

    // Find users with trials ending in 2 days
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, trial_ends_at')
      .eq('subscription_status', 'trial')
      .gte('trial_ends_at', twoDaysFromNow)
      .lt('trial_ends_at', threeDaysFromNow);

    if (error) {
      console.error(`[${JobTypes.TRIAL_REMINDER}] Error:`, error);
      throw error;
    }

    // TODO: Queue email jobs for each user
    // for (const user of users || []) {
    //   await queueJob(JobTypes.SEND_EMAIL, {
    //     to: user.email,
    //     subject: 'Your PlebTest trial is ending soon',
    //     template: 'trial_reminder',
    //     data: { name: user.name, trialEndsAt: user.trial_ends_at },
    //   });
    // }

    console.log(`[${JobTypes.TRIAL_REMINDER}] Found ${users?.length || 0} users for reminders`);
  });
  */

  console.log(`   [cron] Registered job: ${JobTypes.CHECK_SESSION_TIMEOUT} (every 5 min)`);
}
