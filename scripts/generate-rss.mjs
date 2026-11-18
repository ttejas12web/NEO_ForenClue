import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatPolicySafeCaseTitle } from '../src/data/caseSources.ts';
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

function escapeCdata(text) {
  if (!text) return '';
  return String(text).replace(/\s+/g, ' ').trim().replace(/\]\]>/g, ']]&gt;');
}

function formatDate(dateInput) {
  if (!dateInput) return new Date().toUTCString();
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

async function generateRssFeed() {
  console.log('Generating RSS 2.0 Feed (/rss.xml)...');

  const baseUrl = 'https://forenclue.in';
  const nowUtc = new Date().toUTCString();

  let itemsXml = '';
  let totalItems = 0;

  try {
    const configPath = path.resolve(__dirname, '../firebase-applet-config.json');
    let db = null;
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const app = initializeApp(config);
      db = getFirestore(app, config.firestoreDatabaseId);
    }

    // 0. Editorial Forensic Articles
    FORENSIC_ARTICLES.forEach((article) => {
      totalItems++;
      const link = `${baseUrl}/articles/${article.slug}`;
      const pubDate = formatDate(article.updatedDate || article.publishedDate);
      const imageUrl = normalizePublicImageUrl(article.heroImage, baseUrl);

      itemsXml += `    <item>\n`;
      itemsXml += `      <title><![CDATA[${escapeCdata(article.title)}]]></title>\n`;
      itemsXml += `      <link>${link}</link>\n`;
      itemsXml += `      <guid isPermaLink="true">${link}</guid>\n`;
      itemsXml += `      <pubDate>${pubDate}</pubDate>\n`;
      itemsXml += `      <description><![CDATA[${escapeCdata(article.abstract)}]]></description>\n`;
      itemsXml += `      <category><![CDATA[${escapeCdata(article.category)}]]></category>\n`;
      if (imageUrl) {
        itemsXml += `      <enclosure url="${imageUrl.replace(/&/g, '&amp;')}" length="0" type="image/png" />\n`;
      }
      itemsXml += `    </item>\n`;
    });

    // 1. Fetch Cases
    if (db) {
      try {
        const casesSnap = await getDocs(collection(db, 'cases'));
        casesSnap.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'draft') return;
          if (
            UNPUBLISHED_DEMO_CASE_TITLES.has(
              String(data.title || '').trim().toLowerCase()
            )
          )
            return;
          totalItems++;
          const title = formatPolicySafeCaseTitle(
            data.title || 'Forensic Case Analysis'
          );
          const link = `${baseUrl}/cases?case=${encodeURIComponent(doc.id)}`;
          const description =
            data.summary ||
            data.description ||
            'Forensic investigation case analysis and findings.';
          const category = 'Case Study';
          const pubDate = formatDate(data.createdAt || data.date);
          const imageUrl = normalizePublicImageUrl(
            data.image || data.thumbnail,
            baseUrl
          );

          itemsXml += `    <item>\n`;
          itemsXml += `      <title><![CDATA[${escapeCdata(title)}]]></title>\n`;
          itemsXml += `      <link>${link}</link>\n`;
          itemsXml += `      <guid isPermaLink="true">${link}</guid>\n`;
          itemsXml += `      <pubDate>${pubDate}</pubDate>\n`;
          itemsXml += `      <description><![CDATA[${escapeCdata(description)}]]></description>\n`;
          itemsXml += `      <category><![CDATA[${escapeCdata(category)}]]></category>\n`;
          if (imageUrl) {
            itemsXml += `      <enclosure url="${imageUrl.replace(/&/g, '&amp;')}" length="0" type="image/jpeg" />\n`;
          }
          itemsXml += `    </item>\n`;
        });
      } catch (err) {
        console.warn('Could not fetch cases for RSS:', err.message);
      }
    }

    // 2. Fetch Courses
    if (db) {
      try {
        const coursesSnap = await getDocs(collection(db, 'courses'));
        coursesSnap.forEach((doc) => {
          const data = doc.data();
          totalItems++;
          const title = data.title || 'Forensic Course';
          const link = `${baseUrl}/courses?id=${encodeURIComponent(doc.id)}`;
          const description =
            data.description ||
            'Professional forensic science certification course on ForenClue.';
          const category = data.category || 'Courses';
          const pubDate = formatDate(data.createdAt || data.date);
          const imageUrl = normalizePublicImageUrl(
            data.thumbnail || data.image,
            baseUrl
          );

          itemsXml += `    <item>\n`;
          itemsXml += `      <title><![CDATA[${escapeCdata(title)}]]></title>\n`;
          itemsXml += `      <link>${link}</link>\n`;
          itemsXml += `      <guid isPermaLink="true">${link}</guid>\n`;
          itemsXml += `      <pubDate>${pubDate}</pubDate>\n`;
          itemsXml += `      <description><![CDATA[${escapeCdata(description)}]]></description>\n`;
          itemsXml += `      <category><![CDATA[${escapeCdata(category)}]]></category>\n`;
          if (imageUrl) {
            itemsXml += `      <enclosure url="${imageUrl.replace(/&/g, '&amp;')}" length="0" type="image/jpeg" />\n`;
          }
          itemsXml += `    </item>\n`;
        });
      } catch (err) {
        console.warn('Could not fetch courses for RSS:', err.message);
      }
    }

    // 3. Fetch EBooks
    if (db) {
      try {
        const ebooksSnap = await getDocs(collection(db, 'ebooks'));
        ebooksSnap.forEach((doc) => {
          const data = doc.data();
          const titleLower = String(data.title || '').toLowerCase();
          const authorLower = String(data.author || '').toLowerCase();
          if (
            titleLower.includes('careers in forensic science') ||
            authorLower.includes('mrunmayee bodhe')
          ) {
            return;
          }
          totalItems++;
          const title = data.title || 'Forensic E-Book & Magazine';
          const link = `${baseUrl}/ebooks?id=${encodeURIComponent(doc.id)}`;
          const description =
            data.description ||
            data.summary ||
            'Forensic science literature and research e-books on ForenClue.';
          const category = data.category || 'E-Books';
          const pubDate = formatDate(data.createdAt || data.date);
          const imageUrl = normalizePublicImageUrl(
            data.image || data.coverImage,
            baseUrl
          );

          itemsXml += `    <item>\n`;
          itemsXml += `      <title><![CDATA[${escapeCdata(title)}]]></title>\n`;
          itemsXml += `      <link>${link}</link>\n`;
          itemsXml += `      <guid isPermaLink="true">${link}</guid>\n`;
          itemsXml += `      <pubDate>${pubDate}</pubDate>\n`;
          itemsXml += `      <description><![CDATA[${escapeCdata(description)}]]></description>\n`;
          itemsXml += `      <category><![CDATA[${escapeCdata(category)}]]></category>\n`;
          if (imageUrl) {
            itemsXml += `      <enclosure url="${imageUrl.replace(/&/g, '&amp;')}" length="0" type="image/jpeg" />\n`;
          }
          itemsXml += `    </item>\n`;
        });
      } catch (err) {
        console.warn('Could not fetch ebooks for RSS:', err.message);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>ForenClue | Forensic Science EdTech &amp; Investigation Intelligence</title>
    <link>${baseUrl}</link>
    <description>India's premier forensic science and cybersecurity publication and learning platform based in Pune. Peer-reviewed forensic guides, documented case studies, virtual laboratories, and research e-books.</description>
    <language>en-in</language>
    <lastBuildDate>${nowUtc}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og/home.png</url>
      <title>ForenClue</title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}  </channel>
</rss>`;

    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'rss.xml'), xml);
    console.log(`✅ Successfully generated /public/rss.xml with ${totalItems} feed items.`);
    process.exit(0);
  } catch (error) {
    console.warn('Failed to generate RSS feed:', error?.message || error);
    process.exit(0);
  }
}

generateRssFeed();
