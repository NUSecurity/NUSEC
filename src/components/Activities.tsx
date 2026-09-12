import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Code, Users } from "lucide-react";

const activities = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Workshops & Training",
    description:
      "Regular hands-on workshops covering penetration testing, digital forensics, malware analysis, and secure coding practices.",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Certification Prep",
    description:
      "Build the foundational skills that carry over to entry-level security certifications, should you pursue one.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Guest Speakers",
    description:
      "Industry professionals share insights on cybersecurity careers, emerging threats, and cutting-edge technologies.",
  },
];

/**
 * The activity cards inside the About section. Rendered there rather than as a
 * section of their own, so the concrete activities answer "what is NUSEC"
 * directly instead of repeating it a screen later.
 */
const Activities = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <Card
          key={activity.title}
          className="border-border bg-secondary/40 shadow-none transition-colors hover:border-primary/60"
        >
          <CardHeader className="text-center">
            <div className="rounded-full border border-border bg-secondary/60 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="text-primary">{activity.icon}</div>
            </div>
            <CardTitle className="text-foreground text-lg">
              {activity.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center text-sm leading-relaxed">
              {activity.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Activities;
