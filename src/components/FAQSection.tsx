import type { FAQItem } from "@/data/faq";

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQSection({
  items,
  title = "Questions fréquentes",
  subtitle = "Tout ce que vous devez savoir sur le solaire au Maroc",
}: FAQSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
        )}

        {/* Interactive accordion for users */}
        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group border border-border rounded-xl px-5 open:shadow-md transition-shadow"
            >
              <summary className="flex items-center justify-between cursor-pointer py-5 text-left text-base font-medium text-foreground list-none [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <svg
                  className="w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="text-muted-foreground leading-relaxed pb-5">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Crawler-visible plain-text FAQ — hidden from visual users, fully readable by AI crawlers */}
        <div
          className="sr-only"
          aria-hidden="true"
          data-nosnippet=""
        >
          {items.map((item, i) => (
            <div key={i} itemScope itemType="https://schema.org/Question">
              <h3 itemProp="name">{item.question}</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
