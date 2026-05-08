import {
    Code2,
    Lightbulb,
    MapPin,
    Clock,
    Mail,
    Link as LinkIcon,
    User,
    Phone,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export const profile = {
    name: "Luca Perullo",
    handle: "@lucaperullo",
    role: "Software Architect & AI Engineer",
    location: "Italia · remote-first",
    pronouns: "he/him",
    email: "lucaperullo@outlook.it",
    phone: "+39 344 5820014",
    site: "lucaperullo.it",
    avatar: "/brand/avatar.jpg",
    timeZone: "Europe/Rome",
    summary:
        "Costruisco prodotti digitali su misura: web app, integrazioni AI, e-commerce, strumenti per team. Dal primo brief al lancio, con un metodo trasparente — anche se non scrivi codice.",
};

export type ContactDetail = {
    icon: IconType;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
};

export const contactDetails: ContactDetail[] = [
    {
        icon: Code2,
        label: "Ruolo",
        value: "Software Architect & AI Engineer",
    },
    {
        icon: Lightbulb,
        label: "Founder",
        value: "AURA Academy",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Italia · remote-first",
    },
    {
        icon: Clock,
        label: "Time zone",
        value: "Europe/Rome",
    },
    {
        icon: Mail,
        label: "Email",
        value: "lucaperullo@outlook.it",
        href: "mailto:lucaperullo@outlook.it",
    },
    {
        icon: LinkIcon,
        label: "Site",
        value: "lucaperullo.it",
        href: "https://lucaperullo.it",
        external: true,
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+39 344 5820014",
        href: "https://wa.me/393445820014",
        external: true,
    },
    {
        icon: User,
        label: "Pronouns",
        value: "he / him",
    },
];
