import express from 'express';
import Admission from '../models/Admission.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Event from '../models/Event.js';
import Query from '../models/Query.js';
import mockStore from '../config/mockStore.js';
import { uploadAdmissions } from '../middleware/upload.js';

const router = express.Router();

// 1. ANNOUNCEMENTS
// @desc    Get all announcements
// @route   GET /api/public/announcements
router.get('/announcements', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('announcements');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GALLERY
// @desc    Get gallery items
// @route   GET /api/public/gallery
router.get('/gallery', async (req, res) => {
  const { category } = req.query;
  try {
    if (mockStore.isMock) {
      let list = await mockStore.find('gallery');
      if (category && category !== 'all') {
        list = list.filter(item => item.category === category);
      }
      return res.json({ success: true, count: list.length, data: list });
    }
    const query = category && category !== 'all' ? { category } : {};
    const list = await Gallery.find(query).sort({ date: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. EVENTS (Calendar)
// @desc    Get school calendar events
// @route   GET /api/public/events
router.get('/events', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('events');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Event.find().sort({ startDate: 1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. SUBMIT CONTACT QUERY
// @desc    Submit contact query form
// @route   POST /api/public/queries
router.post('/queries', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    if (mockStore.isMock) {
      const query = await mockStore.create('queries', { name, email, phone, subject, message, status: 'unread' });
      return res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: query });
    }
    const query = await Query.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. SUBMIT ADMISSION FORM
// @desc    Apply for admission
// @route   POST /api/public/admissions/apply
router.post('/admissions/apply', (req, res) => {
  res.status(403).json({ 
    success: false, 
    message: 'Online admissions are currently disabled. Please contact the administrator to record an admission.' 
  });
});

// 6. TRACK ADMISSION STATUS
// @desc    Track admission application status
// @route   GET /api/public/admissions/track/:appNo
router.get('/admissions/track/:appNo', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const admission = await mockStore.findOne('admissions', { applicationNumber: req.params.appNo });
      if (!admission) {
        return res.status(404).json({ success: false, message: 'Application number not found' });
      }
      return res.json({ success: true, data: admission });
    }

    const admission = await Admission.findOne({ applicationNumber: req.params.appNo });
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Application number not found' });
    }
    res.json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
