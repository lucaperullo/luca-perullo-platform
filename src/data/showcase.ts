/**
 * Visual studies — pure design demonstrations of craft, NOT fake products.
 * Each piece exists to communicate the level of polish Luca delivers across
 * different surfaces: typography, 3D, data viz, mobile, brand, motion.
 *
 * These are clearly framed in the UI as "studi visivi" / studies — the
 * portfolio (src/data/projects.ts) is reserved for shipped products only.
 */
export type ShowcaseItem = {
    slug: string;
    title: string;
    discipline: string;
    image: string;
    /** Optional short caption for the hover/below-image label */
    caption?: string;
};

export const showcase: ShowcaseItem[] = [
    {
        slug: "render-3d",
        title: "Volumi",
        discipline: "3D · Rendering",
        image: "/showcase/render-3d.jpg",
        caption: "Studio di materiali e luce su forme geometriche essenziali.",
    },
    {
        slug: "typography-poster",
        title: "Studio",
        discipline: "Tipografia · Editorial",
        image: "/showcase/typography-poster.jpg",
        caption: "Composizione tipografica swiss, gerarchia e respiro.",
    },
    {
        slug: "mobile-craft",
        title: "Tre schermi",
        discipline: "Mobile · UI craft",
        image: "/showcase/mobile-craft.jpg",
        caption: "Tre schermate mobile: lista, lettore, calendario.",
    },
    {
        slug: "data-viz",
        title: "Misure",
        discipline: "Data viz · Editorial",
        image: "/showcase/data-viz.jpg",
        caption: "Composizione di tre grafici editoriali in palette zinc.",
    },
    {
        slug: "brand-sheet",
        title: "Identità",
        discipline: "Brand · Sistema",
        image: "/showcase/brand-sheet.jpg",
        caption: "Sheet identitario: marchio, palette, gerarchia tipografica.",
    },
    {
        slug: "motion-frame",
        title: "Movimento",
        discipline: "Motion · Frame",
        image: "/showcase/motion-frame.jpg",
        caption: "Frame fermo di un'animazione tipografica con scia.",
    },
];
