# PostHog post-wizard report

PostHog has been integrated into the Expo React Native application. The `posthog-react-native` SDK and Expo peer dependencies are installed, and the client initializes from `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`. The application now supports touch autocapture, manual Expo Router screen tracking, identified sessions based on the Supabase user ID, and identity reset on sign-out.

Custom product events cover authentication, onboarding, health permission and workout detection, coaching chat delivery, profile changes, and account deletion. Event properties intentionally exclude user-entered names, email addresses, message content, health measurements, and workout dates. Relevant operational failures are captured as PostHog exceptions.

| Event name | Description | File |
| --- | --- | --- |
| `auth_otp_requested` | Captures when a user requests a one-time sign-in code. | `src/features/auth/hooks/useAuth.ts` |
| `auth_signed_in` | Captures when a user successfully signs in. | `src/app/_layout.tsx` |
| `onboarding_completed` | Captures successful completion of the athlete onboarding flow. | `src/features/onboarding/hooks/useOnboarding.ts` |
| `health_permission_denied` | Captures when health-data authorization is unavailable. | `src/features/health/hooks/useHealthData.ts` |
| `workout_detected` | Captures when a newly synced workout is detected. | `src/features/health/hooks/useHealthData.ts` |
| `chat_message_sent` | Captures successful delivery of a message to the coaching assistant. | `src/features/chat/hooks/useChat.ts` |
| `profile_updated` | Captures successful updates to an athlete profile. | `src/features/profile/hooks/useProfile.ts` |
| `account_deleted` | Captures a confirmed account-deletion request before identity reset. | `src/features/profile/hooks/useProfile.ts` |

## Next steps

- [Analytics basics dashboard (wizard)](https://us.posthog.com/project/517384/dashboard/1866338)

The custom events have not yet appeared in the project's ingested event schema, so no saved insights were added. Once the application sends production or development events, add funnel and trend insights to the dashboard using the event names above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

The repository contains an agent skill folder at `.claude/skills/integration-expo` for future PostHog integration work.
