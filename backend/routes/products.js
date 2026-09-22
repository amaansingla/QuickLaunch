const express = require("express");
const router = express.Router();
const pool = require("../db");
const requireAuth = require("../authMiddleware");
const optionalAuth = require("../optionalAuth");

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(baseName) {
  const base = slugify(baseName) || "product";
  let slug = base;
  let attempt = 0;
  while (true) {
    const { rows } = await pool.query(
      "SELECT 1 FROM products WHERE slug = $1",
      [slug],
    );
    if (rows.length === 0) return slug;
    attempt += 1;
    slug = `${base}-${attempt + 1}`;
  }
}

// Create a new product page
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, oneLiner, bullets = [], heroImageUrl } = req.body;
    if (!name || !oneLiner) {
      return res.status(400).json({ error: "name and oneLiner are required" });
    }
    const slug = await uniqueSlug(name);
    const { rows } = await pool.query(
      `INSERT INTO products (slug, name, one_liner, bullet_1, bullet_2, bullet_3, hero_image_url, user_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING *`,
      [
        slug,
        name,
        oneLiner,
        bullets[0] || null,
        bullets[1] || null,
        bullets[2] || null,
        heroImageUrl || null,
        req.userId,
      ],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Get products belonging to the logged-in user (must come before /:slug)
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get a product by slug (used to render the generated page)
router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE slug = $1",
      [req.params.slug],
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Capture an email signup
router.post("/:slug/signups", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: "name and email are required" });

    const { rows: productRows } = await pool.query(
      "SELECT id FROM products WHERE slug = $1",
      [req.params.slug],
    );
    if (productRows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const productId = productRows[0].id;
    await pool.query(
      `INSERT INTO signups (product_id, email, name) VALUES ($1, $2, $3)
       ON CONFLICT (product_id, email) DO NOTHING`,
      [productId, email, name],
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save signup" });
  }
});

// List signups + count (founder dashboard)
router.get("/:slug/signups", async (req, res) => {
  try {
    const { rows: productRows } = await pool.query(
      "SELECT id FROM products WHERE slug = $1",
      [req.params.slug],
    );
    if (productRows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const productId = productRows[0].id;
    const { rows } = await pool.query(
      "SELECT name, email, created_at FROM signups WHERE product_id = $1 ORDER BY created_at DESC",
      [productId],
    );
    res.json({ count: rows.length, signups: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signups" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found or not yours" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;