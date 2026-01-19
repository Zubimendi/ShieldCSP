'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col px-6 py-12 items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">
          This demo application showcases ShieldCSP&apos;s security capabilities. It does not collect or process real
          production data. In a production deployment you would replace this page with your organization&apos;s
          official privacy policy.
        </p>
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            • We only store data you enter locally during the demo session. No real scanning or CSP reports are sent to
            external services yet.
          </p>
          <p>
            • When the backend is wired up according to the PRD, CSP reports and scan results will be stored securely
            in PostgreSQL and may be cached in Redis for performance.
          </p>
          <p>
            • Any API keys, domain names, or sample payloads you use in this demo should be considered test data only.
          </p>
        </div>
      </div>
    </div>
  );
}

