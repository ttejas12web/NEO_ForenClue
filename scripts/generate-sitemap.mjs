import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getCuratedCaseSources,
  hasValidCaseSources,
  formatPolicySafeCaseTitle,
} from '../src/data/caseSources.ts';
import { FORENSIC_ARTICLES } from '../src/data/forensicArticles.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UNPUBLISHED_DEMO_CASE_TITLES = new Set([
  'the phantom breach: apt-33 ransomware attack',
  'the forged stamp of the royal land registry',
  'the museum heist: trace glass & soil analysis',
  'the bones of crimson creek: facial reconstruction',
  'the rg kar medical college tragedy: a forensic investigation',
]);

/**
 * Converts any internal firestore-blob://<id> reference to the public HTTPS
 * endpoint https://forenclue.in/api/social-image/<id> and strips non-public
 * data:/blob:/localdb:// URIs so sitemap.xml never contains invalid image URLs.
 */
function normalizePublicImageUrl(value, baseUrl = 'https://forenclue.in') {
  const source = String(value || '').trim();
  if (!source) return '';
  if (
    source.startsWith('data:') ||
    source.startsWith('blob:') ||
    source.startsWith('localdb://')
  ) {
    return '';
  }
  if (source.startsWith('firestore-blob://')) {
    const blobId = source.slice('firestore-blob://'.length).trim();
    return /^[a-zA-Z0-9_-]{1,128}$/.test(blobId)
      ? `${baseUrl}/api/social-image/${encodeURIComponent(blobId)}`
      : '';
  }
  if (source.includes('firestore-blob://')) {
    const match = source.match(/firestore-blob:\/\/([a-zA-Z0-9_-]{1,128})/);
    if (match && match[1]) {
      return `${baseUrl}/api/social-image/${encodeURIComponent(match[1])}`;
    }
    return '';
  }
  const normalizedHost = source.replace(
    /^https:\/\/www\.forenclue\.in(?=\/|$)/i,
    baseUrl
  );
  try {
    const url = new URL(normalizedHost, baseUrl);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isPublishedCourse(data, documentId) {
  const status = String(data.publicationStatus || data.status || '')
    .trim()
    .toLowerCase();
  if (data.published === true || ['published', 'active', 'live'].includes(status))
    return true;

  const numericId = Number(data.id ?? documentId);
  return (
    numericId === 1 &&
    String(data.title || '').trim().toLowerCase() ===
      'introduction to forensic science'
  );
}

async function generateSitemap() {
  console.log('Generating dynamic sitemap.xml...');

  try {
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.warn('No firebase-applet-config.json found! Skipping sitemap generation.');
      process.exit(0);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const app = initializeApp(config);
    const db = getFirestore(app, config.firestoreDatabaseId);

    const baseUrl = 'https://forenclue.in';
    const currentIsoDate = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Canonical static pages (NO parameterized /colleges?... URLs)
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/articles', priority: '0.95', changefreq: 'daily' },
      ...FORENSIC_ARTICLES.map((article) => ({
        path: `/articles/${article.slug}`,
        priority: '0.9',
        changefreq: 'weekly',
      })),
      {
        path: '/about',
        priority: '0.9',
        changefreq: 'weekly',
        images: [
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG',
            title: 'Tejas Tapse - Founder & CEO of ForenClue',
            caption:
              'Tejas Tapse, Founder & CEO of ForenClue Forensic Science & Cybersecurity EdTech Platform',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjsllQMEHs5qT_GJSyZnGVcFH64Zadagai4Y9rlbFHQ9vuaVgX-3CgkApXQu660nTDPB0C3mEMJoZSnhLnOpBtTOt5mlEEADPKcOZbzcem8pq3flsJWbG6adC-aDmg9tlmyu4nGyaDh-TLzHanJ4dde67VUggiI5rMCb-4dVVUzRhY-A_EJKmiQgLkJez4/s1462/IMG_0859%20(1).PNG',
            title: 'Ayush Gaikwad - Co-Founder of ForenClue',
            caption: 'Ayush Gaikwad, Co-Founder of ForenClue',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtMbZr5AjExAGCqfwCJCaidFxFnNlRkh9KiRw7iwAjS1CINzxnRlEKIEO66fIaUEZfMjRYLOawndJh2aTVyoeSY88Ivbf2dS20SSoaz9YM8QisDdUJqGr1r8-0_-kBe94xNU9G5lpKFpxswLnhFnKQ220eLAvXUdmEaSh0BLle2SdpFiKaL4qC3wogd60/s1600/image.jpeg',
            title: 'Pranav Kale Patil - Managing Director (MD) of ForenClue',
            caption: 'Pranav Kale Patil, Managing Director of ForenClue',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhk5LmpFNaR2YN6ZCUpVLvfWnJimYXwbrNtK9ztFDyfAD2frVDHHplRgN1_KZXjeh2RCHd40Q8EY2y3Qfygkw-wgZeK7rirHtRD-xL-JdW-FD7k0hsm8RSYWZc4gZvYOGkw1iZdp2J0MXzNmuma9_HEFdJMmN3tjmeTEEnbBDbKuMhVIr2xvVLdHN5u7CA/s1600/image.png',
            title: 'Punam Gadade - Chief Technology Officer (CTO) of ForenClue',
            caption:
              'Punam Gadade, Chief Technology Officer (CTO) and Tech Professional at ForenClue',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws',
            title: 'Rajat Pithadia - Academic Mentor at ForenClue',
            caption:
              'Rajat Pithadia, Academic Mentor at ForenClue, UGC-NET & GSET Qualified Assistant Professor and Wiley Author',
          },
        ],
      },
      { path: '/courses', priority: '0.9', changefreq: 'daily' },
      { path: '/cases', priority: '0.9', changefreq: 'daily' },
      { path: '/careers', priority: '0.7', changefreq: 'weekly' },
      { path: '/services', priority: '0.8', changefreq: 'weekly' },
      { path: '/ebooks', priority: '0.9', changefreq: 'daily' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.5', changefreq: 'monthly' },
      { path: '/terms', priority: '0.5', changefreq: 'monthly' },
      { path: '/podcast', priority: '0.8', changefreq: 'weekly' },
      { path: '/certificate', priority: '0.8', changefreq: 'monthly' },
      { path: '/webinar', priority: '0.8', changefreq: 'weekly' },
      { path: '/volunteers', priority: '0.7', changefreq: 'monthly' },
      { path: '/ambassadors', priority: '0.7', changefreq: 'monthly' },
      { path: '/simulations', priority: '0.85', changefreq: 'weekly' },
      { path: '/simulations/microscope', priority: '0.85', changefreq: 'weekly' },
      { path: '/simulations/spectrophotometer', priority: '0.85', changefreq: 'weekly' },
      { path: '/simulations/stereo-microscope', priority: '0.85', changefreq: 'weekly' },
      { path: '/simulations/comparison-microscope', priority: '0.85', changefreq: 'weekly' },
      { path: '/quizzes', priority: '0.8', changefreq: 'daily' },
      { path: '/colleges', priority: '0.95', changefreq: 'daily' },
    ];

    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      if (Array.isArray(page.images)) {
        page.images.forEach((img) => {
          const publicImgUrl = normalizePublicImageUrl(img.loc, baseUrl);
          if (!publicImgUrl) return;
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(publicImgUrl)}</image:loc>\n`;
          if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
          if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
          xml += `    </image:image>\n`;
        });
      }
      xml += `  </url>\n`;
    });

    // 1. Dynamic Cases
    let casesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, 'cases'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'draft') return;
        if (
          UNPUBLISHED_DEMO_CASE_TITLES.has(
            String(data.title || '').trim().toLowerCase()
          )
        )
          return;
        const caseSources = hasValidCaseSources(data.sources)
          ? data.sources
          : getCuratedCaseSources(data.title);
        if (!hasValidCaseSources(caseSources)) return;
        casesFound++;

        const policySafeTitle = formatPolicySafeCaseTitle(data.title);

        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/cases?case=${encodeURIComponent(doc.id)}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        // Main image (converted from firestore-blob:// to /api/social-image/<id>)
        const mainImgUrl = normalizePublicImageUrl(data.image, baseUrl);
        if (mainImgUrl) {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(mainImgUrl)}</image:loc>\n`;
          if (policySafeTitle) {
            xml += `      <image:title>${escapeXml(policySafeTitle)}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }

        // Content images (converted from firestore-blob:// to /api/social-image/<id>)
        if (Array.isArray(data.contentImages)) {
          data.contentImages.forEach((img) => {
            let rawUrl = '';
            let caption = '';
            if (typeof img === 'string') {
              rawUrl = img;
            } else if (img && img.url) {
              rawUrl = img.url;
              caption = img.caption || '';
            }

            const resolvedContentImg = normalizePublicImageUrl(rawUrl, baseUrl);
            if (resolvedContentImg) {
              xml += `    <image:image>\n`;
              xml += `      <image:loc>${escapeXml(resolvedContentImg)}</image:loc>\n`;
              if (caption) {
                const safeCaption = caption.replace(/\bCASS\b/gi, 'Case');
                xml += `      <image:caption>${escapeXml(safeCaption)}</image:caption>\n`;
              } else if (policySafeTitle) {
                xml += `      <image:title>${escapeXml(policySafeTitle)} - Forensic Exhibit</image:title>\n`;
              }
              xml += `    </image:image>\n`;
            }
          });
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${casesFound} dynamic case study pages.`);
    } catch (err) {
      console.warn('Could not load dynamic cases for sitemap:', err.message || err);
    }

    // 2. Dynamic Courses
    let coursesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!isPublishedCourse(data, doc.id)) return;
        coursesFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/courses?id=${encodeURIComponent(doc.id)}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        const courseImg = normalizePublicImageUrl(
          data.thumbnail || data.image,
          baseUrl
        );
        if (courseImg) {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(courseImg)}</image:loc>\n`;
          if (data.title) {
            xml += `      <image:title>${escapeXml(data.title)}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${coursesFound} dynamic course pages.`);
    } catch (err) {
      console.warn('Could not load dynamic courses for sitemap:', err.message || err);
    }

    // 3. Dynamic eBooks (excluding removed Careers in Forensic Science book)
    let ebooksFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, 'ebooks'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const titleLower = String(data.title || '').toLowerCase();
        const authorLower = String(data.author || '').toLowerCase();
        if (
          titleLower.includes('careers in forensic science') ||
          authorLower.includes('mrunmayee bodhe')
        ) {
          return;
        }
        ebooksFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/ebooks?id=${encodeURIComponent(doc.id)}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        const ebookImg = normalizePublicImageUrl(
          data.image || data.coverImage,
          baseUrl
        );
        if (ebookImg) {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(ebookImg)}</image:loc>\n`;
          if (data.title) {
            xml += `      <image:title>${escapeXml(data.title)}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${ebooksFound} dynamic ebook pages.`);
    } catch (err) {
      console.warn('Could not load dynamic ebooks for sitemap:', err.message || err);
    }

    // 4. Dynamic Quizzes
    let quizzesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      querySnapshot.forEach((doc) => {
        quizzesFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/quizzes/${encodeURIComponent(doc.id)}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${quizzesFound} dynamic quiz pages.`);
    } catch (err) {
      console.warn('Could not load dynamic quizzes for sitemap:', err.message || err);
    }

    // 5. Dynamic Colleges
    let collegesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, 'colleges'));
      querySnapshot.forEach((doc) => {
        collegesFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/colleges/${encodeURIComponent(doc.id)}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${collegesFound} dynamic college pages.`);
    } catch (err) {
      console.warn('Could not load dynamic colleges for sitemap:', err.message || err);
    }

    xml += `</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(
      `✅ Successfully generated sitemap.xml with ${staticPages.length} static/article pages and ${
        casesFound + coursesFound + ebooksFound + quizzesFound + collegesFound
      } dynamic pages`
    );

    process.exit(0);
  } catch (error) {
    console.warn('Failed to generate sitemap:', error.message || error);
    process.exit(0);
  }
}

generateSitemap();
