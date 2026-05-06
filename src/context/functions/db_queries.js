import { articles } from './mock-data';

// Read function for the list of first 20 articles in the Homepage
export async function fetchArticles(page = 0, limit = 20) {
  await new Promise(r => setTimeout(r, 300));
  const start = page * limit;
  const data = articles.slice(start, start + limit);
  return { data, hasMore: start + limit < articles.length };
}

// Read function for the next 20 articles (pagination)
export async function fetchMoreArticles(page, limit = 20) {
  return fetchArticles(page, limit);
}

// Read function for a specific article
export async function fetchArticleBySlug(slug) {
  await new Promise(r => setTimeout(r, 200));
  return articles.find(a => a.slug === slug) || null;
}

// Read function for articles by section
export async function fetchArticlesBySection(section, page = 0, limit = 15) {
  await new Promise(r => setTimeout(r, 300));
  const filtered = articles.filter(a => a.section === section);
  const start = page * limit;
  const data = filtered.slice(start, start + limit);
  return { data, hasMore: start + limit < filtered.length };
}

// Search articles
export async function searchArticles(query, page = 0, limit = 15) {
  await new Promise(r => setTimeout(r, 300));
  const q = query.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.content.toLowerCase().includes(q) ||
    a.authors.some(author => author.toLowerCase().includes(q))
  );
  const start = page * limit;
  const data = filtered.slice(start, start + limit);
  return { data, hasMore: start + limit < filtered.length };
}

// Fetch featured articles
export async function fetchFeaturedArticles() {
  await new Promise(r => setTimeout(r, 200));
  return articles.filter(a => a.featured).slice(0, 5);
}
