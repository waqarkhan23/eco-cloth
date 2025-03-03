import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

const FAQ = () => {
  const faqSections = [
    {
      title: "Ordering and Payment",
      questions: [
        {
          q: "How do I place an order?",
          a: "Browse our collection, add items to your cart, and follow the checkout process.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept Mastercard, Visa card, and cash on delivery.",
        },
      ],
    },
    {
      title: "Shipping and Delivery",
      questions: [
        {
          q: "What is your shipping policy?",
          a: "We offer free shipping all across Pakistan.",
        },
        {
          q: "How long does shipping take?",
          a: "Shipping times are typically 3-7 business days.",
        },
        {
          q: "Can I track my order?",
          a: "Yes, you'll receive tracking information via email once your order ships.",
        },
      ],
    },
    {
      title: "Returns and Exchanges",
      questions: [
        {
          q: "Can I return or exchange an item?",
          a: "Yes, please see our return and exchange policy for details.",
        },
        {
          q: "How do I initiate a return or exchange?",
          a: "Contact our customer service team via email or phone to start the process.",
        },
      ],
    },
    {
      title: "Customer Service",
      questions: [
        {
          q: "How do I contact customer service?",
          a: "Reach us via email, phone, or our contact form.",
        },
        {
          q: "What are your business hours?",
          a: "Our customer service team is available Monday-Friday, 9am-5pm.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Frequently Asked Questions
      </h1>
      {faqSections.map((section, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-secondary">
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {section.questions.map((item, qIndex) => (
                <AccordionItem key={qIndex} value={`${index}-${qIndex}`}>
                  <AccordionTrigger className="font-medium text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FAQ;
