export const metadata = { title: "Docs — AgentDub" };

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Japanese", "Mandarin", "Korean", "Arabic", "Hindi", "Russian",
  "Dutch", "Polish", "Turkish", "Swedish", "Indonesian", "Filipino",
];

const STEPS = [
  {
    step: "01",
    title: "Speech-to-Text",
    desc: "Your uploaded file is sent to the ElevenLabs Scribe API, which transcribes the speech into text. Works best with clear spoken audio — avoid files that are mostly music or background noise.",
    badge: "ElevenLabs Scribe",
  },
  {
    step: "02",
    title: "Translation",
    desc: "The transcribed text is sent to Google Gemini, which translates it accurately into your chosen target language while preserving the original tone and meaning.",
    badge: "Gemini 2.5 Flash",
  },
  {
    step: "03",
    title: "Text-to-Speech",
    desc: "The translated text is synthesised into natural-sounding audio by ElevenLabs using a multilingual voice model and returned to you as an MP3 file.",
    badge: "ElevenLabs TTS",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: "var(--color-ash)" }}>
            How it works
          </p>
          <h1 className="font-display text-5xl" style={{ color: "var(--color-text)" }}>
            DOCS
          </h1>
        </div>

        {/* Pipeline */}
        <section className="mb-10">
          <h2 className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: "var(--color-ash)" }}>
            The Pipeline
          </h2>
          <div className="space-y-3">
            {STEPS.map(s => (
              <div
                key={s.step}
                className="flex gap-4 p-5 rounded-xl"
                style={{ background: "rgba(17,17,24,0.7)", border: "1px solid var(--color-border)" }}
              >
                <span className="font-display text-3xl leading-none shrink-0 mt-0.5" style={{ color: "var(--color-volt)" }}>
                  {s.step}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{s.title}</h3>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ background: "rgba(200,241,53,0.08)", color: "var(--color-volt)", border: "1px solid rgba(200,241,53,0.15)" }}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-ash)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported formats */}
        <section className="mb-10">
          <h2 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: "var(--color-ash)" }}>
            Supported File Formats
          </h2>
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(17,17,24,0.7)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {["MP3", "WAV", "MP4", "M4A", "MOV", "WEBM"].map(f => (
                <span
                  key={f}
                  className="text-xs font-mono px-3 py-1 rounded"
                  style={{ background: "rgba(200,241,53,0.06)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--color-ash)" }}>
              Maximum file size is <span style={{ color: "var(--color-text)" }}>500 MB</span>. For best results keep files under <span style={{ color: "var(--color-text)" }}>25 MB</span>. Larger files will take longer to process.
            </p>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-10">
          <h2 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: "var(--color-ash)" }}>
            Supported Languages
          </h2>
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(17,17,24,0.7)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <span
                  key={lang}
                  className="text-xs px-3 py-1 rounded"
                  style={{ background: "rgba(17,17,24,0.8)", color: "var(--color-ash)", border: "1px solid var(--color-border)" }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: "var(--color-ash)" }}>
            Tips for Best Results
          </h2>
          <div className="space-y-2">
            {[
              "Use audio with a single clear speaker — multiple overlapping voices reduce accuracy.",
              "Avoid files with heavy background music or noise.",
              "Shorter files (under 2 minutes) process faster and are ideal for demos.",
              "If ElevenLabs returns a 500 error, try converting your file to MP3 first.",
              "The dubbed audio uses a fixed voice — it won't clone the original speaker's voice on a free plan.",
            ].map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 px-4 py-3 rounded-lg text-xs"
                style={{ background: "rgba(17,17,24,0.5)", border: "1px solid var(--color-border)", color: "var(--color-ash)" }}
              >
                <span style={{ color: "var(--color-volt)" }}>→</span>
                {tip}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}