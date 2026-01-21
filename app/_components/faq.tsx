import FAQAccordion from "./faq-accordion";

function FAQ() {
  return (
    <section className="relative py-20 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about skill bartering
            </p>
          </div>

          {/* FAQ Accordion */}
          <FAQAccordion />

          {/* Still have questions */}
          <div
            className="text-center mt-12 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
