const express = require('express');
const Url = require('../models/Url');
const { Log } = require('../utils/logger');
const router = express.Router();

router.get('/:shortcode', async (req, res) => {
    try {
        const urlDoc = await Url.findOne({ shortcode: req.params.shortcode });

        if (!urlDoc) {
            Log("backend", "info", "handler", `Redirect failed: shortcode '${req.params.shortcode}' not found.`);
            return res.status(404).json({ error: 'Shortcode not found' });
        }

        if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
            Log("backend", "info", "handler", `Redirect failed: shortcode '${req.params.shortcode}' has expired.`);
            return res.status(410).json({ error: 'This link has expired.' });
        }

        urlDoc.clickHistory.push({
            timestamp: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        await urlDoc.save();

        Log("backend", "info", "handler", `Redirecting shortcode '${req.params.shortcode}' to ${urlDoc.originalUrl}.`);
        return res.redirect(urlDoc.originalUrl);

    } catch (error) {
        Log("backend", "error", "db", `Error during redirect for '${req.params.shortcode}': ${error.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
