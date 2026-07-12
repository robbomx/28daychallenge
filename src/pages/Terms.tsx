import type { ReactNode } from "react";
import Card from "../components/Card";

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <span className="mono-label text-xs text-op-orange">Legal</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-3">Terms of Service</h1>
      <p className="text-xs text-op-off-white-dim mb-10">Last updated: [insert date before publishing]</p>

      <Card variant="panel" className="p-6 mb-8 border-op-sand/40">
        <p className="text-xs text-op-sand leading-relaxed">
          <strong>Template notice:</strong> jurisdiction (Victoria, Australia) and the refund policy below reflect
          what you've specified. This is still a starting draft, not lawyer-reviewed legal advice — get the
          liability limitation clause and overall wording checked before relying on it commercially.
        </p>
      </Card>

      <div className="flex flex-col gap-8 text-sm text-op-off-white-dim leading-relaxed">
        <Section title="1. What you're buying">
          <p>
            The 28 Day Standard is a digital, self-guided bodyweight fitness program: 28 days of workout content, a
            progress tracker, nutrition guidelines, and related tools, delivered through this website for a
            one-time payment of $39 AUD. It is general fitness guidance only, not personal training, medical
            advice, or a medical service of any kind.
          </p>
        </Section>

        <Section title="2. Health disclaimer">
          <p>
            You should consult a qualified healthcare professional before starting this or any exercise program,
            particularly if you have an injury, a medical condition, or are pregnant. You are responsible for
            exercising within your own limits and stopping if something feels wrong. We are not liable for any
            injury or health outcome arising from your participation in the program.
          </p>
        </Section>

        <Section title="3. Payment">
          <p>
            Payment is processed securely by Stripe. We do not receive or store your card details. Prices are shown
            in AUD and are inclusive of any applicable taxes unless stated otherwise.
          </p>
        </Section>

        <Section title="4. Refunds">
          <p>
            You're entitled to a full refund if you request one within 7 days of purchase, provided you have not
            completed more than 3 days of the program. To request a refund, contact us at the email below with
            your account email address. Refund requests made outside this window, or after completing more than 3
            days, are considered at our discretion.
          </p>
          <p className="mt-3 text-xs text-op-off-white-dim/80">
            This policy is in addition to, and does not limit, any rights you have under the Australian Consumer
            Law that cannot be excluded.
          </p>
        </Section>

        <Section title="5. Your account">
          <p>
            You're responsible for keeping your login details confidential and for all activity under your
            account. Let us know immediately if you suspect unauthorized access.
          </p>
        </Section>

        <Section title="6. Acceptable use">
          <p>
            The program and its content are for your personal, non-commercial use. You may not resell, redistribute,
            or publicly republish the workout content, nutrition guidance, or other materials without our written
            permission.
          </p>
        </Section>

        <Section title="7. Availability">
          <p>
            We aim to keep the site available and your progress accessible, but we don't guarantee uninterrupted
            access and aren't liable for outages, data loss, or technical issues beyond our reasonable control.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by law, our liability for any claim relating to the program is limited
            to the amount you paid for it. We are not liable for indirect, incidental, or consequential damages.
          </p>
          <p className="mt-3 text-xs text-op-off-white-dim/80">
            Nothing in these terms excludes, restricts, or modifies any consumer guarantee, right, or remedy under
            the Australian Consumer Law that cannot lawfully be excluded — including guarantees relating to
            acceptable quality and fitness for purpose. Where liability for breach of such a guarantee cannot be
            excluded but can be limited, our liability is limited to the extent permitted by law. This clause
            should still be reviewed by a lawyer before you rely on it — enforceability of liability caps varies
            by circumstance.
          </p>
        </Section>

        <Section title="9. Changes to the program or these terms">
          <p>
            We may update the program content or these terms from time to time. Continued use of the site after
            changes take effect means you accept the updated terms.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These terms are governed by the laws of Victoria, Australia, and you submit to the non-exclusive
            jurisdiction of the courts of Victoria for any dispute arising from them.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these terms can be sent to{" "}
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
