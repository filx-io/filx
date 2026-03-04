import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const LAST_UPDATED = "March 1, 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using FilX.io (the "Service"), you agree to be bound by these Terms of Use. If you do not agree to these terms, do not use the Service. FilX reserves the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.`,
  },
  {
    title: "2. Description of Service",
    body: `FilX.io is a file conversion API built for AI agents and developers. The Service provides programmatic access to file conversion, OCR, image processing, and data extraction endpoints via the x402 payment protocol. Payments are made in USDC on the Base blockchain (chain ID 8453).`,
  },
  {
    title: "3. Eligibility",
    body: `You must be at least 18 years old and capable of forming a legally binding contract to use this Service. By using FilX, you represent that you meet these requirements. Use of the Service is not permitted where prohibited by applicable law.`,
  },
  {
    title: "4. API Usage & Fair Use",
    body: `You may use the FilX API for lawful purposes only. You agree not to: (a) use the Service to process illegal, harmful, or infringing content; (b) attempt to reverse-engineer, scrape, or circumvent the payment system; (c) abuse rate limits or engage in denial-of-service attacks; (d) resell or sublicense access to the API without prior written consent from FilX.`,
  },
  {
    title: "5. Payments & Billing",
    body: `All API requests are billed per-use in USDC on Base mainnet via the x402 protocol. You are responsible for maintaining sufficient funds in your agent wallet. FilX does not issue refunds for successfully processed requests. No charge is applied on failed requests (4xx/5xx errors). Minimum charge per job is $0.001 USDC.`,
  },
  {
    title: "6. Wallet & Keys",
    body: `FilX provides an embedded agent wallet secured by Privy. Your FILX_API_KEY is a rotatable credential — you are responsible for keeping it confidential. FilX is not liable for unauthorized use of your API key or wallet resulting from your failure to secure it. The underlying private key is managed server-side and is never accessible to you or to FilX staff.`,
  },
  {
    title: "7. Data & File Processing",
    body: `Files submitted to the API are fetched from publicly accessible URLs, processed, and the output is stored temporarily (1 hour) before automatic deletion. FilX does not retain, analyze, or sell the content of files you process. You are solely responsible for ensuring you have the right to process any file submitted to the Service.`,
  },
  {
    title: "8. Intellectual Property",
    body: `The FilX platform, brand, and codebase are the property of FilX and its contributors. The API itself is provided under the MIT License where applicable. You retain all rights to the files and content you submit and the output you receive.`,
  },
  {
    title: "9. Disclaimers",
    body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. FILX MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. FILX DOES NOT GUARANTEE UNINTERRUPTED OR ERROR-FREE SERVICE.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, FILX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.`,
  },
  {
    title: "11. Termination",
    body: `FilX reserves the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service immediately ceases. Provisions of these Terms that by their nature should survive termination shall survive.`,
  },
  {
    title: "12. Governing Law",
    body: `These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration or in the courts of competent jurisdiction, as applicable.`,
  },
  {
    title: "13. Contact",
    body: `For questions about these Terms of Use, contact us at hello@filx.io.`,
  },
];

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="font-mono text-xs text-slate-600">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="font-mono text-sm text-slate-500 leading-relaxed">
              Please read these Terms of Use carefully before using the FilX.io API and services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="space-y-2">
                <h2 className="font-mono font-bold text-slate-200 text-sm">{s.title}</h2>
                <p className="font-mono text-xs text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="border-t border-white/[0.06] pt-6">
            <p className="font-mono text-[10px] text-slate-700">
              © 2026 FILX.io All Rights Reserved. · <a href="/privacy" className="hover:text-slate-500 transition-colors">Privacy Policy</a>
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
