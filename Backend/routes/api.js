const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const { Log } = require('../utils/logger');
const router = express.Router();
router.post('/', async (req, res) => {
    const { url, validity, shortcode } = req.body;

    if (!url) {
        Log("backend", "error", "handler", "POST /shorturls - URL is missing from request body.");
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let code = shortcode;
        if (code) {
            const existing = await Url.findOne({ shortcode: code });
            if (existing) {
                Log("backend", "warn", "handler", `POST /shorturls - Custom shortcode '${code}' already exists.`);
                return res.status(409).json({ error: 'Shortcode already in use.' });
            }
        } else {
            code = nanoid(7);
        }

        const expiryMinutes = validity || 30;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const newUrl = new Url({
            originalUrl: url,
            shortcode: code,
            expiresAt: expiresAt,
        });

        await newUrl.save();
        Log("backend", "info", "handler", `Successfully created short link for ${url} with code ${code}.`);

        res.status(201).json({
            shortLink: `http://localhost:3000/${code}`,
            expiry: expiresAt.toISOString(),
        });

    } catch (error) {
        Log("backend", "fatal", "db", "Error creating short URL in DB"); console.error("Full error details:", error);
res.status(500).json({ error: 'Server error' });
    }
});
router.get('/', async (req, res) => {
    try {
        const urls = await Url.find({}).sort({ createdAt: -1 });
        Log("backend", "info", "handler", "Fetched all URLs for stats page.");
        res.json(urls);
    } catch (error) {
        Log("backend", "error", "db", "Error fetching all URLs.");
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:shortcode', async (req, res) => {
    try {
        const urlDoc = await Url.findOne({ shortcode: req.params.shortcode });
        if (!urlDoc) {
            Log("backend", "warn", "handler", `GET /shorturls/:shortcode - Shortcode not found: ${req.params.shortcode}`);
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        res.json({
            originalUrl: urlDoc.originalUrl,
            shortcode: urlDoc.shortcode,
            createdAt: urlDoc.createdAt,
            expiresAt: urlDoc.expiresAt,
            totalClicks: urlDoc.clickHistory.length,
            clickHistory: urlDoc.clickHistory
        });

    } catch (error) {
        Log("backend", "error", "db", `Error retrieving stats for ${req.params.shortcode}: ${error.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
