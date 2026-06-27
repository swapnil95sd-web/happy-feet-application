# Deployment

Vercel is configured by `vercel.json` to build the Happy Feet client:

```json
{
  "buildCommand": "pnpm --filter @workspace/happy-feet run build",
  "outputDirectory": "artifacts/happy-feet/dist/public",
  "installCommand": "pnpm install",
  "framework": null
}
```

## Required Vercel Environment Variables

- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key.
- `VITE_ADMIN_EMAIL`: admin email used as a fallback while Supabase profile roles are being set up.

## Optional Email Notification Variables

Booking emails use the serverless endpoint at `/api/notify-booking`. Bookings still save normally if these are missing. Admins can also send student status emails from the Bookings tab after updating booking/payment status.

- `RESEND_API_KEY`: Resend API key for sending email.
- `ADMIN_NOTIFICATION_EMAIL`: where new booking request emails should go.
- `NOTIFICATION_FROM_EMAIL`: verified sender, for example `Happy Feet <bookings@yourdomain.com>`. If this is not set, Resend's onboarding sender is used for early testing.

For real student emails, verify a sending domain in Resend and use that address for `NOTIFICATION_FROM_EMAIL`.

## Supabase Manual Steps

1. Enable Supabase Auth email sign-in or magic links.
2. Add the production Vercel domain to Supabase Auth redirect URLs.
3. Add RLS policies from `docs/Supabase_RLS_Policies.md`.
4. Ensure `site_content` has a `homepage` row.
5. Ensure admin users have matching rows in `profiles` with `role = 'admin'`.
6. Confirm storage buckets exist:
   - `class-images`
   - `site-images`
   - `gallery`
   - `instructor-images`

## Local Verification

The whole workspace build needs the existing mockup sandbox environment defaults:

```sh
PORT=3000 BASE_PATH=/ pnpm run build
```

For Vercel, the configured build command targets only `@workspace/happy-feet`, so these mockup sandbox variables are not required by the production Happy Feet deployment.
