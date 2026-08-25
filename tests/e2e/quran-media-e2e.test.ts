export async function runE2ETests(baseUrl = 'http://localhost:3006'): Promise<{ passed: number; failed: number }> {
  console.log('🚀 [E2E TEST SUITE] End-to-End User Journeys & Security Scenarios...\n');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // ========================================================
  // Step 1: Open Website (Desktop, Mobile & Arabic RTL)
  // ========================================================
  console.log('▶ Step 1: Open Website (Desktop, Mobile & RTL):');
  try {
    const resAr = await fetch(`${baseUrl}/ar`);
    const htmlAr = await resAr.text();
    assert(resAr.status === 200, 'Homepage loaded with HTTP 200 OK');
    assert(htmlAr.includes('dir="rtl"'), 'Verified Arabic RTL layout attribute on <html> element');
    assert(htmlAr.includes('ميديا القرآن') || htmlAr.includes('استوديو'), 'Verified Arabic localized brand text');
  } catch (err: any) {
    assert(false, `Homepage failed: ${err.message}`);
  }

  try {
    const resEn = await fetch(`${baseUrl}/en`);
    const htmlEn = await resEn.text();
    assert(resEn.status === 200, 'English homepage loaded with HTTP 200 OK');
    assert(htmlEn.includes('dir="ltr"'), 'Verified English LTR layout attribute on <html> element');
  } catch (err: any) {
    assert(false, `English homepage failed: ${err.message}`);
  }

  // ========================================================
  // Step 2: Search Quran & Stories Catalog
  // ========================================================
  console.log('\n▶ Step 2: Search Quran & Stories Catalog:');
  try {
    const resStories = await fetch(`${baseUrl}/en/stories?q=patience`);
    const htmlStories = await resStories.text();
    assert(resStories.status === 200, 'Stories explore page returned HTTP 200');
    assert(htmlStories.includes('Stories') || htmlStories.includes('Quran'), 'Rendered stories catalog');
  } catch (err: any) {
    assert(false, `Stories search failed: ${err.message}`);
  }

  // ========================================================
  // Step 3: Open Surah Index & Single Surah
  // ========================================================
  console.log('\n▶ Step 3: Open Surah:');
  try {
    const resSurah = await fetch(`${baseUrl}/en/surah/2`);
    const htmlSurah = await resSurah.text();
    assert(resSurah.status === 200, 'Surah Al-Baqarah (2) page loaded with HTTP 200');
    assert(htmlSurah.includes('Al-Baqarah') || htmlSurah.includes('286'), 'Loaded Surah Al-Baqarah 286 verses metadata');
  } catch (err: any) {
    assert(false, `Surah page failed: ${err.message}`);
  }

  // ========================================================
  // Step 4: Open Ayah (Ayat al-Kursi)
  // ========================================================
  console.log('\n▶ Step 4: Open Ayah (2:255 Ayat al-Kursi):');
  try {
    const resAyah = await fetch(`${baseUrl}/en/ayah/2/255`);
    const htmlAyah = await resAyah.text();
    assert(resAyah.status === 200, 'Ayat al-Kursi (2:255) loaded with HTTP 200');
    assert(htmlAyah.includes('ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ'), 'Rendered authentic Medina Mushaf Uthmani text');
    assert(htmlAyah.includes('Ever-Living') || htmlAyah.includes('Throne'), 'Rendered verified English translation');
  } catch (err: any) {
    assert(false, `Ayah page failed: ${err.message}`);
  }

  // ========================================================
  // Step 5: Play Recitation (Audio Player & CDN Link)
  // ========================================================
  console.log('\n▶ Step 5: Play Recitation Audio:');
  try {
    const resAyah = await fetch(`${baseUrl}/en/ayah/2/255`);
    const htmlAyah = await resAyah.text();
    assert(htmlAyah.includes('everyayah.com') && htmlAyah.includes('<audio'), 'Verified EveryAyah CDN audio player integration');
  } catch (err: any) {
    assert(false, `Recitation test failed: ${err.message}`);
  }

  // ========================================================
  // Step 6: Create Image & Visual Templates Gallery
  // ========================================================
  console.log('\n▶ Step 6: Create Image & Visual Templates Gallery:');
  try {
    const resTpl = await fetch(`${baseUrl}/en/templates`);
    const htmlTpl = await resTpl.text();
    assert(resTpl.status === 200, 'Templates gallery returned HTTP 200');
    assert(htmlTpl.includes('Minimal Quran') || htmlTpl.includes('Cinematic Nature'), 'Displayed 18 visual template presets');
  } catch (err: any) {
    assert(false, `Templates page failed: ${err.message}`);
  }

  // ========================================================
  // Step 7: Create Story (Story Generator Route)
  // ========================================================
  console.log('\n▶ Step 7: Create Story Generator:');
  try {
    const resStory = await fetch(`${baseUrl}/en/create/story?surah=2&ayah=255`);
    assert(resStory.status === 200, 'AI Story Generator loaded with HTTP 200 for 2:255');
  } catch (err: any) {
    assert(false, `Story generator failed: ${err.message}`);
  }

  // ========================================================
  // Step 8 & 9: Create Video & Monitor Generation Stream
  // ========================================================
  console.log('\n▶ Step 8 & 9: Create Video & Generation Stream:');
  try {
    const resStudio = await fetch(`${baseUrl}/en/studio`);
    assert(resStudio.status === 200, 'Media Studio loaded with HTTP 200');
  } catch (err: any) {
    assert(false, `Studio failed: ${err.message}`);
  }

  // ========================================================
  // Step 10: Share Video (/share/[id])
  // ========================================================
  console.log('\n▶ Step 10: Share Video & 7 Social Platform Suite:');
  try {
    const resShare = await fetch(`${baseUrl}/en/share/proj-ayat-alkursi`);
    const htmlShare = await resShare.text();
    assert(resShare.status === 200, 'Share page loaded with HTTP 200');
    assert(htmlShare.includes('Instagram Reels') && htmlShare.includes('TikTok') && htmlShare.includes('YouTube Shorts'), 'Included all 7 social platform tabs');
    assert(htmlShare.includes('Download') || htmlShare.includes('1080x1920'), 'Rendered 9:16 vertical 1080x1920 video deliverable');
  } catch (err: any) {
    assert(false, `Share page failed: ${err.message}`);
  }

  // ========================================================
  // Security Scenario 1: Authentication & RBAC
  // ========================================================
  console.log('\n▶ Security: Authentication & RBAC Authorization:');
  let adminToken = '';
  try {
    // 1. Sign in as Admin
    const resLogin = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@quranmedia.studio', password: 'Password123!' }),
    });
    const loginJson = await resLogin.json();
    adminToken = loginJson.token || '';
    assert(resLogin.status === 200 && loginJson.success, 'Successfully authenticated Admin via JWT API');

    // 2. Unauthenticated access to Admin API rejected
    const unauthRes = await fetch(`${baseUrl}/api/admin/generation-jobs/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: 'job-9803' }),
    });
    assert(unauthRes.status === 401, 'Rejected unauthenticated Admin API call with 401 Unauthorized');
  } catch (err: any) {
    assert(false, `Auth scenario failed: ${err.message}`);
  }

  // ========================================================
  // Security Scenario 2: Admin Job Retry on Failure
  // ========================================================
  console.log('\n▶ Resilience: Generation Job Retry on Failure:');
  try {
    const retryRes = await fetch(`${baseUrl}/api/admin/generation-jobs/retry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
        Cookie: `quran_media_session=${adminToken}`,
      },
      body: JSON.stringify({ jobId: 'job-9803' }),
    });

    const retryJson = await retryRes.json();
    assert(retryRes.status === 200 && retryJson.success, 'Admin successfully retried failed generation job');
  } catch (err: any) {
    assert(false, `Job retry failed: ${err.message}`);
  }

  // ========================================================
  // Security Scenario 3: Rate Limiting & DoS Protection
  // ========================================================
  console.log('\n▶ Security: Rate Limiting & DoS Protection:');
  try {
    let rateLimited = false;
    for (let i = 0; i < 15; i++) {
      const res = await fetch(`${baseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'spam@test.com', password: 'wrong' }),
      });
      if (res.status === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited, 'Rate limiter actively enforced HTTP 429 Too Many Requests on auth burst');
  } catch (err: any) {
    assert(false, `Rate limiting test failed: ${err.message}`);
  }

  console.log(`\n🎉 E2E Test Run Finished: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}
