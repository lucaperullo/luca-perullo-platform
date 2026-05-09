/**
 * Layout dedicato per la pagina lezione interattiva (full viewport).
 *
 * Bypassa lo styling tipico delle altre pagine del sito (no SideLines,
 * no max-w-prose) — ci serve l'intera viewport per ospitare avatar +
 * editor + preview in 3 colonne.
 */
export default function PlayLessonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-10 flex flex-col bg-bg">
            {children}
        </div>
    );
}
