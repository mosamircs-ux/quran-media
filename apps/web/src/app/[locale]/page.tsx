import { type Locale } from '@quran-media/i18n';
import { HeroSection } from '../../components/hero-section';
import { FeaturedStories } from '../../components/featured-stories';
import { LatestMediaGrid } from '../../components/latest-media-grid';
import { PopularAyahs } from '../../components/popular-ayahs';
import { PopularSurahs } from '../../components/popular-surahs';
import { QuranStoriesSection } from '../../components/quran-stories-section';
import { VideoTemplates } from '../../components/video-templates';
import { HowItWorks } from '../../components/how-it-works';
import { InteractiveStudioWidget } from '../../components/interactive-studio-widget';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section: Turn Every Ayah Into a Story */}
      <HeroSection locale={locale} />

      <div id="explore" className="scroll-mt-24">
        {/* Section 1: Featured Stories */}
        <FeaturedStories locale={locale} />

        {/* Section 2: Latest Quran Media */}
        <LatestMediaGrid locale={locale} />
      </div>

      {/* Section 3: Popular Ayahs */}
      <PopularAyahs locale={locale} />

      {/* Section 4: Popular Surahs */}
      <PopularSurahs locale={locale} />

      {/* Section 5: Quran Stories & Narrative Reflections */}
      <QuranStoriesSection locale={locale} />

      {/* Section 6: Video Templates & Aspect Ratio Explorer */}
      <VideoTemplates locale={locale} />

      {/* Section 7: How It Works */}
      <HowItWorks locale={locale} />

      {/* Section 8: Create Your First Video (Interactive Studio Widget) */}
      <InteractiveStudioWidget locale={locale} />
    </div>
  );
}
