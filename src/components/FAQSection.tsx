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

        {/* FAQ accordion – answers always in DOM for crawlers */}
        <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
          {items.map((item, i) => (
            <div
              key={i}
              className="group border border-border rounded-xl px-5"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between cursor-pointer py-5 text-left text-base font-medium text-foreground"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";
                  const chevron = e.currentTarget.querySelector("svg");
                  if (isOpen) {
                    content.style.maxHeight = "0px";
                    content.style.opacity = "0";
                    chevron?.classList.remove("rotate-180");
                    e.currentTarget.closest(".group")?.classList.remove("shadow-md");
                  } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.style.opacity = "1";
                    chevron?.classList.add("rotate-180");
                    e.currentTarget.closest(".group")?.classList.add("shadow-md");
                  }
                }}
                aria-expanded="false"
              >
                <span itemProp="name">{item.question}</span>
                <svg
                  className="w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform duration-200"
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
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: "0px", opacity: 0 }}
                itemScope
                itemType="https://schema.org/Answer"
                itemProp="acceptedAnswer"
              >
                <p className="text-muted-foreground leading-relaxed pb-5" itemProp="text">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
