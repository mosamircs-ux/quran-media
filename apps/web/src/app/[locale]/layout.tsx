import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import '../globals.css';
import { LOCALES_META, type Locale } from '@quran-media/i18n';
import { ThemeProvider } from '../../components/theme-provider';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic' });

export const metadata: Metadata = {
  title: 'Quran Media Studio — Turn Every Ayah Into a Story',
  description:
    'Create beautiful Quran-inspired visual stories and videos from any Ayah or Surah with synchronized recitations, bilingual subtitles, and cinematic atmospheres.',
  openGraph: {
    title: 'Quran Media Studio — Turn Every Ayah Into a Story',
    description: 'Create beautiful Quran-inspired visual stories and videos from any Ayah or Surah.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const meta = LOCALES_META[locale] || LOCALES_META.ar;

  return (
    <html lang={locale} dir={meta.dir} className={`${inter.variable} ${amiri.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
