import type { ReactNode } from "react";

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="mono-label text-xs text-op-orange">Legal</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-3">Privacy Policy</h1>
      <p className="text-xs text-op-off-white-dim mb-10">Last updated: 12 July 2026</p>

      <div className="flex flex-col gap-8 text-sm text-op-off-white-dim leading-relaxed">
        <Section title="What we collect">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>Account details: first name, email address, and a password (stored as a secure hash, never in plain text).</li>
            <li>Fitness level and goal selection, used to scale workout difficulty and tone.</li>
            <li>
              A lightweight progress summary (current day, days completed, streak, last active date) so we can see
              how the program is landing and offer support if you get stuck.
            </li>
            <li>Payment is handled entirely by Stripe — we never see or store your card details.</li>
          </ul>
        </Section>

        <Section title="What stays on your device">
          <p>
            Your day-by-day workout completion, checklist history, and any before/after photos you upload are
            stored locally in your browser, not on our servers. This means that data is private to the device and
            browser you use, and won't automatically appear if you log in elsewhere. Clearing your browser data
            will remove it.
          </p>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>To create and secure your account, and verify payment.</li>
            <li>To personalize the tone and difficulty of the program to your fitness level.</li>
            <li>To understand, in aggregate, how people progress through the program and where they tend to drop off, so we can improve it.</li>
            <li>To contact you about your account or the program if needed.</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to third parties.</p>
        </Section>

        <Section title="Who can see your data">
          <p>
            Account information and your progress summary is visible to the site administrator through an
            internal, password-protected dashboard used to run and support the program. It is not shared publicly
            or with advertisers.
          </p>
        </Section>

        <Section title="Cookies and local storage">
          <p>
            The site uses your browser's local storage (not tracking cookies) to keep you logged in and to store
            your workout progress and photos on your device.
          </p>
        </Section>

        <Section title="Data retention and deletion">
          <p>
            We keep your account information for as long as your account exists. To request deletion of your
            account and associated data, email us at the address below — we'll action it as soon as reasonably
            possible.
          </p>
        </Section>

        <Section title="Security">
          <p>
            Passwords are hashed, not stored in plain text, and payment is processed entirely by Stripe. No system
            is perfectly secure, and we can't guarantee absolute security of information transmitted over the
            internet.
          </p>
        </Section>

        <Section title="Children">
          <p>This program is not intended for anyone under 16, and we don't knowingly collect data from children.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy from time to time. Material changes will be reflected here with an updated date.</p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or your data can be sent to{" "}
            <a href="mailto:support@the28daystandard.com" className="text-op-orange hover:underline">
              support@the28daystandard.com
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl text-op-off-white mb-3">{title}</h2>
      {children}
    </div>
  );
}
