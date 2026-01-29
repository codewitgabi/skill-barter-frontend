import FAQAccordion from "./faq-accordion";

const faqs = [
  {
    question: "How does skill bartering work?",
    answer:
      "Skill bartering is simple: you teach someone a skill you know in exchange for learning a skill you want. For example, if you're a web developer, you can teach coding to someone who teaches you photography. No money changes hands - it's a direct skill-for-skill exchange.",
  },
  {
    question: "Is it really free?",
    answer:
      "Yes, completely free! There are no subscription fees, no hidden costs, and no money involved in skill exchanges. The platform operates on a barter system where members exchange their expertise directly with each other.",
  },
  {
    question: "How do I ensure quality?",
    answer:
      "We have a robust rating and review system. After each skill exchange, both parties can rate and review each other. This helps build trust and ensures quality. We also verify member profiles and encourage detailed skill portfolios to help you make informed decisions.",
  },
  {
    question: "What if someone doesn't deliver on their promise?",
    answer:
      "If you encounter issues with a skill exchange, our support team is here to help. We have a dispute resolution process and can mediate between members. Additionally, our rating system helps identify reliable members, and you can always report problematic behavior.",
  },
  {
    question: "How are disputes handled?",
    answer:
      "We take disputes seriously. Members can report issues through our support system, and our team will investigate. We encourage open communication between members first, but we're here to help resolve conflicts fairly and ensure a positive experience for everyone.",
  },
  {
    question: "Can I exchange multiple skills?",
    answer:
      "Absolutely! You can list multiple skills you can teach and learn multiple skills from different members. Many of our members have ongoing exchanges with several people, building a diverse skill set over time.",
  },
  {
    question: "How do I schedule sessions?",
    answer:
      "Once you connect with a skill provider, you can use our built-in messaging system to discuss your goals and schedule sessions. The platform provides tools to coordinate timing that works for both parties, whether it's in-person or online.",
  },
  {
    question: "What skills can I exchange?",
    answer:
      "Almost any teachable skill! From technical skills like programming and design, to creative skills like music and art, to practical skills like cooking and languages. If you can teach it and someone wants to learn it, you can exchange it on our platform.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-20 overflow-hidden bg-muted/20 scroll-mt-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
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
              href="mailto:support@skillbarter.com"
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
