/**
 * Stub di tipi per `@monaco-editor/react`.
 *
 * Esiste solo per far passare il typecheck prima che `npm install` venga
 * lanciato sul Mac di Luca (mount FUSE non permette install via Claude).
 *
 * Quando il pacchetto sarà davvero installato, i suoi tipi reali (più
 * completi) verranno fusi con questi via TypeScript module augmentation.
 */
declare module "@monaco-editor/react" {
    import type { ComponentType, ReactNode } from "react";

    export type EditorOnChange = (
        value: string | undefined,
        ev?: unknown,
    ) => void;

    export interface EditorProps {
        height?: string | number;
        width?: string | number;
        defaultLanguage?: string;
        language?: string;
        defaultValue?: string;
        value?: string;
        theme?: string;
        path?: string;
        loading?: ReactNode;
        options?: Record<string, unknown>;
        onChange?: EditorOnChange;
        onMount?: (editor: unknown, monaco: unknown) => void;
        beforeMount?: (monaco: unknown) => void;
        className?: string;
    }

    const Editor: ComponentType<EditorProps>;
    export default Editor;
}
