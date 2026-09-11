import Activities from "@/components/Activities";
import BinaryStream from "@/components/animations/BinaryStream";

const About = () => {
  return (
    <section id="about" className="py-20 bg-cyber-darker relative">
      <BinaryStream className="absolute inset-0" speed={100} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-primary">NUSEC</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Northeastern Security Club (NUSEC) is a student-led organization
            dedicated to fostering a cybersecurity community & awareness at
            Northeastern University. We bring together passionate students to
            explore the fascinating world of information security while
            providing opportunities for students. We focus on professional
            development, technical workshops, and community events.
          </p>
        </div>

        <Activities />
      </div>
    </section>
  );
};

export default About;
