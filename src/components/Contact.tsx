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
    icon: <Mail className="w-8 h-8 text-white" />,
    title: "Email Us",
    description: "General inquiries and questions",
    action: { type: "email", address: "nusechusky@gmail.com" },
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    title: "Discord",
    description: "Join our active community chat",
    action: {
      type: "link",
      href: "https://discord.gg/JkYMdTbuDw",
      label: "Join Server",
    },
  },
  {
    icon: <Instagram className="w-8 h-8 text-white" />,
    title: "Instagram",
    description: "Stay updated on our latest events!",
    action: {
      type: "link",
      href: "https://www.instagram.com/nusecurity/",
      label: "Follow Us",
    },
  },
  {
    icon: <MapPin className="w-8 h-8 text-white" />,
    title: "Behrakis",
    description: "Room 105",
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
          className="border-primary text-primary hover:bg-primary hover:text-white"
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
            Ready to develop your cybersecurity journey? Connect with us and
            become part of the most dynamic security community on campus.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method) => (
            <Card
              key={method.title}
              className="bg-gradient-card border-border hover:scale-105 transition-all text-center"
            >
              <CardHeader>
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
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
          <Card className="bg-gradient-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground text-2xl">
                Ready to Get Started?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                <TerminalText
                  text="No prior experience required! We welcome students from all majors and skill levels. Whether you're a complete beginner or an experienced security enthusiast, there's a place for you in NUSEC."
                  speed={20}
                />
              </p>

              <p className="text-muted-foreground text-sm mt-6">
                <strong className="text-primary">
                  New Member Orientation:
                </strong>{" "}
                Any meeting — just show up!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
