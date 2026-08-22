import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { ProjectsClient } from '@/components/dashboard/projects-client';

export const metadata: Metadata = {
  title: 'Media Projects Workspace — Quran Media Studio',
  description: 'Manage Quran media project folders, series, and batch assets.',
  openGraph: {
    title: 'Media Projects Workspace — Quran Media Studio',
    description: 'Organize Quran media generations into folders and scheduled series.',
    type: 'website',
  },
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <ProjectsClient locale={locale} />
    </div>
  );
}
