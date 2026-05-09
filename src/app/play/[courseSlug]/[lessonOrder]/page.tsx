import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonRunner } from "@/components/play/lesson-runner";
import {
    getCourseBySlug,
    getLessonByOrder,
    getModuleForLesson,
    playCourses,
} from "@/data/play";

type Params = { courseSlug: string; lessonOrder: string };

export function generateStaticParams(): Params[] {
    return playCourses
        .filter((c) => c.status === "live")
        .flatMap((c) =>
            c.lessons.map((l) => ({
                courseSlug: c.slug,
                lessonOrder: String(l.order),
            })),
        );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { courseSlug, lessonOrder } = await params;
    const order = Number(lessonOrder);
    const course = getCourseBySlug(courseSlug);
    const lesson = getLessonByOrder(courseSlug, order);
    if (!course || !lesson) {
        return { title: "Lezione non trovata · Luca Perullo" };
    }
    return {
        title: `${lesson.title} · ${course.title}`,
        description: lesson.script.slice(0, 160),
        robots: { index: false, follow: true },
    };
}

export default async function LessonPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { courseSlug, lessonOrder } = await params;
    const order = Number(lessonOrder);
    if (!Number.isFinite(order)) notFound();

    const course = getCourseBySlug(courseSlug);
    if (!course || course.status !== "live") notFound();

    const lesson = getLessonByOrder(courseSlug, order);
    if (!lesson) notFound();

    const courseModule = getModuleForLesson(courseSlug, order);
    if (!courseModule) notFound();

    return (
        <LessonRunner
            key={`${course.slug}-${lesson.order}`}
            lesson={lesson}
            module={courseModule}
            courseSlug={course.slug}
            courseTitle={course.title}
            courseInitialCode={course.initialCode}
            totalLessons={course.lessons.length}
        />
    );
}
