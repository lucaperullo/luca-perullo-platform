export type StackEntry = { label: string; group: "Frontend" | "Backend" | "AI" | "DX" };

export const stack: StackEntry[] = [
    { label: "TypeScript", group: "Frontend" },
    { label: "React", group: "Frontend" },
    { label: "Next.js", group: "Frontend" },
    { label: "Tailwind CSS", group: "Frontend" },
    { label: "Framer Motion", group: "Frontend" },
    { label: "Node.js", group: "Backend" },
    { label: "PostgreSQL", group: "Backend" },
    { label: "Supabase", group: "Backend" },
    { label: "Rust", group: "Backend" },
    { label: "OpenAI / Anthropic", group: "AI" },
    { label: "RAG", group: "AI" },
    { label: "Vector DBs", group: "AI" },
    { label: "Vercel", group: "DX" },
    { label: "GitHub Actions", group: "DX" },
    { label: "Figma", group: "DX" },
];
