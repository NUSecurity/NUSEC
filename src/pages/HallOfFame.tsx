import { useEffect } from "react";

interface Award {
  name: string;
  winner: string;
}

interface Category {
  title: string;
  awards: Award[];
}

const categories: Category[] = [
  {
    title: "BONUS!",
    awards: [{ name: "Bonus 1 - ???", winner: "Could be you!" }],
  },
  {
    title: "GM POINTS!",
    awards: [
      { name: "NUSEC JEAPORDY!!", winner: "MATRIX" },
      { name: "NUSEC GOT PHISHED - Phishing Competition!", winner: "Timmy loves yippee!" },
    ],
  },
  {
    title: "$3CRET$!",
    awards: [],
  },
];

export default function HallOfFame() {
  useEffect(() => {
    document.title = "NUSEC Hall Of Fame";
  }, []);

  return (
    <div className="min-h-screen bg-black px-5 py-8 text-center font-sans text-base text-[#ea183f]">
      <h1 className="mb-8 text-4xl font-bold text-[#eab83f] md:text-5xl lg:text-[53px]">
        NUSEC Hall Of Fame
      </h1>

      <button
        type="button"
        onClick={() => window.prompt("You serious? Just Ctrl+R you lazy.")}
        className="mb-10 border-b-2 border-dotted border-[#ea187f] text-xl font-bold text-[#ea187f] transition-colors hover:text-[#eaa87f] md:text-[27px]"
      >
        The Amazing Refresh Button &reg;
      </button>

      <div className="mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-3">
        {categories.map((category) => (
          <section key={category.title} className="px-4">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#eab83f] [text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_0_3px_rgba(255,215,0,1)]">
              {category.title}
            </h2>

            {category.awards.map((award) => (
              <div key={award.name} className="mb-8">
                <h3 className="text-[21px] font-bold tracking-tight text-[#5574a7]">
                  {award.name}
                </h3>
                <p>{award.winner}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
