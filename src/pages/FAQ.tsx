import FAQSection from "@/components/FAQSection";
import JsonLd from "@/components/seo/JsonLd";
import { faqData } from "@/data/faq";
import { fullFaqSchema } from "@/config/seoSchemas";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function FAQ() {
  usePageMeta({
    title: "FAQ Solaire Maroc 2025 – 12 Questions Répondues | SOLARBOX",
    description: "Coûts, Loi 82-21, ONEE, aides AMEE... Toutes les réponses sur l'installation solaire au Maroc par les experts NOORIA.",
  });

  return (
    <>
      <JsonLd schema={fullFaqSchema} />

      <main className="flex-1 pt-16">
        <div className="text-center pt-12 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            FAQ – Énergie Solaire au Maroc
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Retrouvez les réponses aux questions les plus posées sur le solaire,
            l'autoconsommation et les aides disponibles au Maroc en 2025.
          </p>
        </div>

        <FAQSection
          items={faqData}
          title=""
          subtitle=""
        />
      </main>

    </>
  );
}
