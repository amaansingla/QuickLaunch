const express = require('express');
const router = express.Router();
const pool = require('../db');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(baseName) {
  const base = slugify(baseName) || 'product';
  let slug = base;
  let attempt = 0;
  while (true) {
    const { rows } = await pool.query('SELECT 1 FROM products WHERE slug = $1', [slug]);
    if (rows.length === 0) return slug;
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
}

// Create a new product page
router.post('/', async (req, res) => {
  try {
    const { name, oneLiner, bullets = [], heroImageUrl } = req.body;
    if (!name || !oneLiner) {
      return res.status(400).json({ error: 'name and oneLiner are required' });
    }
    const slug = await uniqueSlug(name);
    const { rows } = await pool.query(
      `INSERT INTO products (slug, name, one_liner, bullet_1, bullet_2, bullet_3, hero_image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [slug, name, oneLiner, bullets[0] || null, bullets[1] || null, bullets[2] || null, heroImageUrl || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get a product by slug (used to render the generated page)
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE slug = $1', [req.params.slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Capture an email signup
router.post('/:slug/signups', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    const { rows: productRows } = await pool.query('SELECT id FROM products WHERE slug = $1', [req.params.slug]);
    if (productRows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const productId = productRows[0].id;
    await pool.query(
      `INSERT INTO signups (product_id, email) VALUES ($1, $2)
       ON CONFLICT (product_id, email) DO NOTHING`,
      [productId, email]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save signup' });
  }
});

// List signups + count (founder dashboard)
router.get('/:slug/signups', async (req, res) => {
  try {
    const { rows: productRows } = await pool.query('SELECT id FROM products WHERE slug = $1', [req.params.slug]);
    if (productRows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const productId = productRows[0].id;
    const { rows } = await pool.query(
      'SELECT email, created_at FROM signups WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    );
    res.json({ count: rows.length, signups: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
});

module.exports = router;