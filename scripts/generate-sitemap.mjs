import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCuratedCaseSources, hasValidCaseSources } from '../src/data/caseSources.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UNPUBLISHED_DEMO_CASE_TITLES = new Set([
  'the phantom breach: apt-33 ransomware attack',
  'the forged stamp of the royal land registry',
  'the museum heist: trace glass & soil analysis',
  'the bones of crimson creek: facial reconstruction',
  'the rg kar medical college tragedy: a forensic investigation',
]);

function normalizePublicUrl(value) {
  return String(value || '').replace(/^https:\/\/www\.forenclue\.in(?=\/|$)/i, 'https://forenclue.in');
}

function ebookSitemapImageUrl(value, baseUrl) {
  const source = String(value || '').trim();
  if (!source) return '';
  if (source.startsWith('firestore-blob://')) {
    const blobId = source.slice('firestore-blob://'.length);
    return /^[a-zA-Z0-9_-]{1,128}$/.test(blobId)
      ? `${baseUrl}/api/social-image/${encodeURIComponent(blobId)}`
      : '';
  }
  try {
    const url = new URL(normalizePublicUrl(source), baseUrl);
    // Inline data and browser-local URLs cannot be crawled as sitemap images.
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function isPublishedCourse(data, documentId) {
  const status = String(data.publicationStatus || data.status || '').trim().toLowerCase();
  if (data.published === true || ['published', 'active', 'live'].includes(status)) return true;

  const numericId = Number(data.id ?? documentId);
  return numericId === 1 && String(data.title || '').trim().toLowerCase() === 'introduction to forensic science';
}

async function generateSitemap() {
  console.log('Generating dynamic case sitemap.xml...');

  try {
    // Read Firebase Config
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
        console.warn("No firebase-applet-config.json found! Skipping sitemap generation.");
        process.exit(0);
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Initialize Firebase
    const app = initializeApp(config);
    const db = getFirestore(app, config.firestoreDatabaseId);

    const baseUrl = 'https://forenclue.in';
    const currentIsoDate = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static pages configurations
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      {
        path: '/about',
        priority: '0.9',
        changefreq: 'weekly',
        images: [
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG',
            title: 'Tejas Tapse - Founder of ForenClue',
            caption: 'Tejas Tapse, Founder of ForenClue Forensic Science & Cybersecurity EdTech Platform',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt-N4hwGU4tzUkx9XwNKGHv2Te4J3tbfxJWFRXS6Z3KzdZX1f9VKZB88MYTeF4OqePRwDcGMbqjmOpoROSJlsSHaZJnLEIMnP2S98gBLOlP6IDs33SBqLf7yhLEyWCICI90IfGk5XV06fUYonMDC5zufGitO8-sTe1sIExdZcckiMh0VuZmmmPJpxhGQs/s1352/IMG_0866.PNG',
            title: 'Mrunmayee Bodhe - Chief Executive Officer (CEO) of ForenClue',
            caption: 'Mrunmayee Bodhe, Chief Executive Officer of ForenClue Ventures',
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
            caption: 'Punam Gadade, Chief Technology Officer (CTO) and Tech Professional at ForenClue',
          },
          {
            loc: 'https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws',
            title: 'Rajat Pithadia - Academic Mentor at ForenClue',
            caption: 'Rajat Pithadia, Academic Mentor at ForenClue, UGC-NET & GSET Qualified Assistant Professor and Wiley Author',
          },
        ],
      },
      { path: '/courses', priority: '0.9', changefreq: 'daily' },
      { path: '/cases', priority: '0.9', changefreq: 'daily' },
      { path: '/careers', priority: '0.7', changefreq: 'weekly' },
      { path: '/services', priority: '0.8', changefreq: 'weekly' },
      { path: '/ebooks', priority: '0.9', changefreq: 'daily' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
      { path: '/terms', priority: '0.3', changefreq: 'monthly' },
      { path: '/podcast', priority: '0.8', changefreq: 'weekly' },
      { path: '/certificate', priority: '0.8', changefreq: 'monthly' },
      { path: '/webinar', priority: '0.8', changefreq: 'weekly' },
      { path: '/volunteers', priority: '0.7', changefreq: 'monthly' },
      { path: '/ambassadors', priority: '0.7', changefreq: 'monthly' },
      { path: '/simulations', priority: '0.8', changefreq: 'weekly' },
      { path: '/simulations/microscope', priority: '0.8', changefreq: 'weekly' },
      { path: '/simulations/spectrophotometer', priority: '0.8', changefreq: 'weekly' },
      { path: '/quizzes', priority: '0.8', changefreq: 'daily' },
    ];

    staticPages.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      if (Array.isArray(page.images)) {
        page.images.forEach((img) => {
          const safeLoc = img.loc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeTitle = (img.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeCaption = (img.caption || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${safeLoc}</image:loc>\n`;
          if (safeTitle) xml += `      <image:title>${safeTitle}</image:title>\n`;
          if (safeCaption) xml += `      <image:caption>${safeCaption}</image:caption>\n`;
          xml += `    </image:image>\n`;
        });
      }
      xml += `  </url>\n`;
    });

    // 1. Dynamic Cases
    let casesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, "cases"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'draft') return;
        if (UNPUBLISHED_DEMO_CASE_TITLES.has(String(data.title || '').trim().toLowerCase())) return;
        const caseSources = hasValidCaseSources(data.sources)
          ? data.sources
          : getCuratedCaseSources(data.title);
        if (!hasValidCaseSources(caseSources)) return;
        casesFound++;

        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/cases?case=${doc.id}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        // Main image
        if (data.image) {
          xml += `    <image:image>\n`;
          const safeUrl = normalizePublicUrl(data.image).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `      <image:loc>${safeUrl}</image:loc>\n`;
          if (data.title) {
              const safeTitle = data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              xml += `      <image:title>${safeTitle}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }

        // Content images
        if (Array.isArray(data.contentImages)) {
          data.contentImages.forEach((img) => {
            let url = "";
            let caption = "";
            if (typeof img === 'string') {
              url = img;
            } else if (img && img.url) {
              url = img.url;
              caption = img.caption || "";
            }

            if (url) {
              xml += `    <image:image>\n`;
              const safeUrl = normalizePublicUrl(url).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
              xml += `      <image:loc>${safeUrl}</image:loc>\n`;
              if (caption) {
                  const safeCaption = caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  xml += `      <image:caption>${safeCaption}</image:caption>\n`;
              } else if (data.title) {
                  const safeTitle = data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  xml += `      <image:title>${safeTitle} - Case File Evidence</image:title>\n`;
              }
              xml += `    </image:image>\n`;
            }
          });
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${casesFound} dynamic case study pages.`);
    } catch (err) {
      console.warn("Could not load dynamic cases for sitemap:", err.message || err);
    }

    // 2. Dynamic Courses
    let coursesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!isPublishedCourse(data, doc.id)) return;
        coursesFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/courses?id=${doc.id}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        const courseImg = data.thumbnail || data.image;
        if (courseImg) {
          xml += `    <image:image>\n`;
          const safeUrl = normalizePublicUrl(courseImg).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `      <image:loc>${safeUrl}</image:loc>\n`;
          if (data.title) {
            const safeTitle = data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            xml += `      <image:title>${safeTitle}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${coursesFound} dynamic course pages.`);
    } catch (err) {
      console.warn("Could not load dynamic courses for sitemap:", err.message || err);
    }

    // 3. Dynamic eBooks
    let ebooksFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, "ebooks"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ebooksFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/ebooks?id=${doc.id}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        const ebookImg = ebookSitemapImageUrl(data.image || data.coverImage, baseUrl);
        if (ebookImg) {
          xml += `    <image:image>\n`;
          const safeUrl = normalizePublicUrl(ebookImg).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `      <image:loc>${safeUrl}</image:loc>\n`;
          if (data.title) {
            const safeTitle = data.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            xml += `      <image:title>${safeTitle}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        }
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${ebooksFound} dynamic ebook pages.`);
    } catch (err) {
      console.warn("Could not load dynamic ebooks for sitemap:", err.message || err);
    }

    // 4. Dynamic Quizzes
    let quizzesFound = 0;
    try {
      const querySnapshot = await getDocs(collection(db, "quizzes"));
      querySnapshot.forEach((doc) => {
        quizzesFound++;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/quizzes/${doc.id}</loc>\n`;
        xml += `    <lastmod>${currentIsoDate}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      });
      console.log(`- Loaded ${quizzesFound} dynamic quiz pages.`);
    } catch (err) {
      console.warn("Could not load dynamic quizzes for sitemap:", err.message || err);
    }

    xml += `</urlset>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`✅ successfully generated sitemap.xml with ${staticPages.length} static pages and ${casesFound + coursesFound + ebooksFound + quizzesFound} dynamic pages`);

    process.exit(0);

  } catch (error) {
    console.warn("Failed to generate sitemap:", error.message || error);
    process.exit(0);
  }
}

generateSitemap();
