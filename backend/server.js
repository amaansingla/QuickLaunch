const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const generateRouter = require('./routes/generate');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', productsRouter);
app.use('/api/generate', generateRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`QuickLaunch API running on port ${PORT}`));