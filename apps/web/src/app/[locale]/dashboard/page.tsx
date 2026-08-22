import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export const metadata: Metadata = {
  title: 'Creator Studio Dashboard — Quran Media Studio',
  description: 'Manage video generation queues, review media analytics, and monitor cloud storage rendering jobs.',
  openGraph: {
    title: 'Creator Studio Dashboard — Quran Media Studio',
    description: 'Track media rendering jobs and generation pipelines in real-time.',
    type: 'website',
  },
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <DashboardClient locale={locale} />
    </div>
  );
}
