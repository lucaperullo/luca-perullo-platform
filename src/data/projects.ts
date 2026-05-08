/**
 * Public-facing portfolio. Only shipped products live here — never invented
 * concept work. If a project isn't real, it doesn't belong on this list.
 */
export type Project = {
    slug: string;
    name: string;
    summary: string;
    image?: string;
    tags: string[];
    href: string;
    external?: boolean;
};

export const projects: Project[] = [
    {
        slug: "natural-body-trainer",
        name: "Natural Body Trainer",
        summary:
            "Coach AI per allenamento, nutrizione e recupero — programma adattivo che evolve con i tuoi dati.",
        image: "/projects/natural-body-trainer.jpg",
        tags: ["Web app", "AI", "Mobile-first"],
        href: "https://naturalbodytrainer.com",
        external: true,
    },
    {
        slug: "habitz",
        name: "Habitz",
        summary:
            "Gestione intelligente della convivenza: spese condivise, abitudini di casa e karma tra coinquilini.",
        image: "/projects/habitz.jpg",
        tags: ["Web app", "Community", "Gamification"],
        href: "https://gethabitz.com",
        external: true,
    },
];
