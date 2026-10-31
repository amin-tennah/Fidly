/** What `authorizeRealtime` needs from the Supabase browser client. */
export interface RealtimeAuthSource {
  readonly auth: {
    getSession: () => Promise<{
      data: { session: { access_token: string } | null };
      error: unknown;
    }>;
  };
  readonly realtime: { setAuth: (token: string) => Promise<void> };
}

/**
 * Hands the signed-in user's token to Realtime before any channel joins. Without it the
 * subscription is registered as `anon`, and the RLS silently hides every row: the
 * channel says SUBSCRIBED but no event ever arrives.
 * (`getSession` only reads the token for Realtime; no authorisation decision is taken
 * from it, the database policies do that.)
 */
export async function authorizeRealtime(supabase: RealtimeAuthSource): Promise<void> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return;
  }
  await supabase.realtime.setAuth(data.session.access_token);
}
