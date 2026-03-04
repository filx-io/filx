import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const LAST_UPDATED = "March 1, 2026";

const SECTIONS = [
  {
    title: "1. Overview",
    body: `FilX.io ("FilX", "we", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our API and website. By using FilX, you agree to the collection and use of information in accordance with this policy.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect minimal information necessary to provide the Service:\n\n• Email address — collected during wallet creation via Privy for authentication purposes.\n• Wallet address — your embedded wallet address on Base mainnet, generated at login.\n• API usage data — endpoint called, timestamp, file size, processing time, and cost in USDC. We do not log request/response content beyond what is necessary for billing.\n• IP address and basic request metadata — collected for security monitoring and rate limiting.`,
  },
  {
    title: "3. Information We Do Not Collect",
    body: `FilX does not collect, store, or retain:\n\n• The content of files you submit for processing (inputs and outputs are temporarily cached for up to 1 hour, then permanently deleted).\n• Private keys — your wallet's private key is managed by Privy and is never accessible to FilX staff or systems.\n• Payment card information — all payments are made in USDC on-chain; no card data is ever processed.\n• Browsing history or tracking cookies beyond standard session management.`,
  },
  {
    title: "4. How We Use Your Information",
    body: `We use the information we collect to:\n\n• Authenticate your identity and associate API usage with your agent wallet.\n• Process and bill API requests in USDC via the x402 protocol.\n• Monitor for abuse, rate limiting, and security threats.\n• Send transactional emails (e.g., wallet creation confirmation) — we do not send marketing emails without explicit opt-in.\n• Improve the reliability and performance of the Service.`,
  },
  {
    title: "5. Data Sharing & Third Parties",
    body: `We do not sell, trade, or rent your personal information. We may share information with:\n\n• Privy — our embedded wallet provider, for authentication and key management. Privy's Privacy Policy applies to data they process.\n• Base / Coinbase — on-chain transaction data (wallet addresses and USDC amounts) is publicly visible on the Base blockchain by its nature.\n• Infrastructure providers — hosting, monitoring, and logging services bound by data processing agreements.\n\nWe may disclose information if required by law or to protect the rights and safety of FilX and its users.`,
  },
  {
    title: "6. File Data & Processing",
    body: `Files you submit to the API are fetched from URLs you provide, processed in-memory or in temporary storage, and the output is made available via a short-lived download URL (expires in 1 hour). After expiry, all input and output data is permanently deleted from our systems. We do not analyze, train on, or retain the content of your files.`,
  },
  {
    title: "7. On-Chain Data",
    body: `Payments made through FilX are settled on the Base blockchain. Blockchain transactions — including wallet addresses and USDC amounts — are publicly visible and immutable by design. FilX does not control the visibility of on-chain data.`,
  },
  {
    title: "8. Data Security",
    body: `We implement industry-standard security measures to protect your data, including encrypted communications (TLS), secure key management via Privy, and access controls on our infrastructure. However, no method of transmission over the internet is 100% secure. You are responsible for keeping your FILX_API_KEY confidential.`,
  },
  {
    title: "9. Data Retention",
    body: `We retain account data (email, wallet address, API usage logs) for as long as your account is active or as needed to comply with legal obligations. You may request deletion of your account data by contacting us at hello@filx.io. File processing data is deleted automatically within 1 hour.`,
  },
  {
    title: "10. Your Rights",
    body: `Depending on your jurisdiction, you may have rights to access, correct, or delete your personal data. To exercise these rights, contact us at hello@filx.io. We will respond within 30 days.`,
  },
  {
    title: "11. Children's Privacy",
    body: `The Service is not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have collected data from a minor, contact us immediately at hello@filx.io.`,
  },
  {
    title: "12. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "13. Contact",
    body: `For privacy-related questions or requests, contact us at hello@filx.io.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#08090d] font-mono text-slate-300">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

          {/* Header */}
          <div className="space-y-3 border-b border-white/[0.06] pb-8">
            <p className="font-mono text-[#3b82f6] text-xs uppercase tracking-widest font-bold">
              // legal
            </p>
            <h1 className="font-mono font-black text-2xl md:text-3xl uppercase tracking-widest text-slate-100">
              Privacy Policy
            </h1>
            <p className="font-mono text-xs text-slate-600">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="font-mono text-sm text-slate-500 leading-relaxed">
              FilX is committed to minimal data collection and maximum transparency. This policy explains exactly what we collect and why.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="space-y-2">
                <h2 className="font-mono font-bold text-slate-200 text-sm">{s.title}</h2>
                <p className="font-mono text-xs text-slate-500 leading-relaxed whitespace-pre-line">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="border-t border-white/[0.06] pt-6">
            <p className="font-mono text-[10px] text-slate-700">
              © 2026 FILX.io All Rights Reserved. · <a href="/terms" className="hover:text-slate-500 transition-colors">Terms of Use</a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
