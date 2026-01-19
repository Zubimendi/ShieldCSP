'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col px-6 py-12 items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-black mb-4">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-8">
          These demo terms apply to your use of the ShieldCSP demo environment. They are not a substitute for a real
          legal agreement, but they communicate how this UI is intended to be used.
        </p>
        <div className="space-y-4 text-sm text-slate-300">
          <p>• Use this environment only with non‑sensitive, test domains and sample payloads.</p>
          <p>• The UI may simulate scans and violations using dummy data until the backend is enabled.</p>
          <p>• No uptime or security guarantees are provided for this demo instance.</p>
        </div>
      </div>
    </div>
  );
}

