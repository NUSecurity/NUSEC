import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, MessageSquare, MapPin } from "lucide-react";
import TerminalText from "@/components/animations/TerminalText";
import BinaryStream from "@/components/animations/BinaryStream";
import type { ReactNode } from "react";

type ContactAction =
  | { type: "link"; href: string; label: string }
  | { type: "email"; address: string }
  | { type: "text"; value: string };

interface ContactMethod {
  icon: ReactNode;
  title: string;
  description: string;
  action: ContactAction;
}

const contactMethods: ContactMethod[] = [
  {
    icon: <Mail className="w-8 h-8 text-primary" />,
    title: "Email Us",
    description: "General inquiries and questions",
    action: { type: "email", address: "nusechusky@gmail.com" },
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Discord",
    description: "Join our active community chat",
    action: {
      type: "link",
      href: "https://discord.gg/JkYMdTbuDw",
      label: "Join Server",
    },
  },
  {
    icon: <Instagram className="w-8 h-8 text-primary" />,
    title: "Instagram",
    description: "Stay updated on our latest events!",
    action: {
      type: "link",
      href: "https://www.instagram.com/nusecurity/",
      label: "Follow Us",
    },
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Shillman 305",
    description: "Tuesdays, 6:00 – 7:30 PM",
    action: { type: "text", value: "Northeastern University" },
  },
];

const ContactActionContent = ({ action }: { action: ContactAction }) => {
  switch (action.type) {
    case "email":
      return (
        <a
          href={`mailto:${action.address}`}
          className="text-primary hover:underline font-medium"
        >
          {action.address}
        </a>
      );
    case "link":
      return (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <a href={action.href} target="_blank" rel="noopener noreferrer">
            {action.label}
          </a>
        </Button>
      );
    case "text":
      return (
        <span className="text-primary font-medium">{action.value}</span>
      );
  }
};

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background relative">
      <BinaryStream className="absolute inset-0" speed={150} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join <span className="text-primary">NUSEC</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ready to start your cybersecurity journey? Connect with us and
            become part of the most dynamic security community on campus.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card
              key={method.title}
              className="border-border bg-secondary/40 text-center shadow-none transition-colors hover:border-primary/60"
            >
              <CardHeader>
                <div className="rounded-full border border-border bg-secondary/60 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {method.icon}
                </div>
                <CardTitle className="text-foreground">
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {method.description}
                </p>
                <ContactActionContent action={method.action} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border bg-secondary/40 shadow-none">
            <CardContent className="text-center pt-6">
              <p className="text-muted-foreground">
                <TerminalText
                  text="No prior experience required! We welcome students from all majors and skill levels. Whether you're a complete beginner or an experienced security enthusiast, there's a place for you in NUSEC."
                  speed={20}
                />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
