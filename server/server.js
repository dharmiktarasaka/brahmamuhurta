import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Registration from './models/Registration.js';

// Resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server setting notice:', e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/narayan_presence';

const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DB_FILE = path.join(DATA_DIR, 'registrations.json');

// Local fallback DB helpers
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readLocalBackup() {
  try {
    if (!fs.existsSync(BACKUP_DB_FILE)) return [];
    const raw = fs.readFileSync(BACKUP_DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLocalBackup(data) {
  try {
    fs.writeFileSync(BACKUP_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Backup DB] Write error:', err);
  }
}

// MongoDB Connection State
let isMongoConnected = false;

async function connectMongoDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log(`🍃 [MongoDB Connected] Database active at: ${MONGODB_URI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ [MongoDB Notice] Could not connect to MongoDB at ${MONGODB_URI} (${err.message}).`);
    console.log(`📁 [Storage Fallback] Operating with local persistent storage in server/data/registrations.json.`);
  }
}

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('🍃 [MongoDB State] Connected');
});
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});
mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
});

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: isMongoConnected ? 'MongoDB' : 'Local Persistent Storage',
    mongoUri: MONGODB_URI,
    timestamp: new Date().toISOString()
  });
});

// 1. POST /api/register (Landing Page Registration Form)
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, whatsapp, country, fee, stuckArea, liveCommit, goDeeper, status, notes } = req.body;

    if (!fullName || !email || !whatsapp) {
      return res.status(400).json({ success: false, error: 'Full name, email, and WhatsApp number are required.' });
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      country: country || 'India',
      fee: fee || 'FREE',
      stuckArea: stuckArea ? stuckArea.trim() : '',
      liveCommit: liveCommit || "Yes, I'll be there live",
      goDeeper: goDeeper || "Yes, if it's right for me",
      status: status || 'Confirmed',
      notes: notes || '',
      registeredAt: new Date()
    };

    let savedEntry;
    let totalCount = 0;

    if (isMongoConnected) {
      savedEntry = await Registration.create(payload);
      totalCount = await Registration.countDocuments();
      console.log(`🍃 [MongoDB] Registered new participant: ${savedEntry.fullName}`);
    } else {
      const list = readLocalBackup();
      const newLocal = {
        ...payload,
        id: 'reg_' + Date.now(),
        registeredAt: payload.registeredAt.toISOString()
      };
      list.unshift(newLocal);
      writeLocalBackup(list);
      savedEntry = newLocal;
      totalCount = list.length;
      console.log(`📁 [Local DB] Registered new participant: ${newLocal.fullName}`);
    }

    return res.status(201).json({ success: true, registration: savedEntry, total: totalCount });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process registration.' });
  }
});

// 2. GET /api/admin/registrations (Admin Panel Data Fetch)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    let registrations = [];

    if (isMongoConnected) {
      registrations = await Registration.find().sort({ createdAt: -1, registeredAt: -1 }).lean();
      // Ensure id field is set
      registrations = registrations.map(r => ({ ...r, id: r._id?.toString() || r.id }));
    } else {
      registrations = readLocalBackup();
    }

    return res.json({ success: true, registrations, total: registrations.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve registrations.' });
  }
});

// 3. PATCH /api/admin/registrations/:id (Update Status or Coach Notes)
app.patch('/api/admin/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    let updatedRecord;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      updatedRecord = await Registration.findByIdAndUpdate(id, updateFields, { new: true });
    } else {
      const list = readLocalBackup();
      const idx = list.findIndex(r => r.id === id || r._id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updateFields };
        writeLocalBackup(list);
        updatedRecord = list[idx];
      }
    }

    if (!updatedRecord) {
      return res.status(404).json({ success: false, error: 'Participant not found.' });
    }

    return res.json({ success: true, registration: updatedRecord });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update participant record.' });
  }
});

// 4. DELETE /api/admin/registrations/:id (Delete Participant)
app.delete('/api/admin/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      await Registration.findByIdAndDelete(id);
    } else {
      let list = readLocalBackup();
      list = list.filter(r => r.id !== id && r._id !== id);
      writeLocalBackup(list);
    }

    return res.json({ success: true, message: 'Participant record deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete record.' });
  }
});

// 5. GET /api/admin/export (Download CSV)
app.get('/api/admin/export', async (req, res) => {
  try {
    let registrations = [];
    if (isMongoConnected) {
      registrations = await Registration.find().sort({ createdAt: -1 }).lean();
    } else {
      registrations = readLocalBackup();
    }

    const headers = ['ID', 'Full Name', 'Email', 'WhatsApp', 'Country', 'Fee', 'Stuck Area', 'Live Commit', 'Go Deeper', 'Status', 'Registered At', 'Notes'];
    const escapeCsv = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
    
    const rows = registrations.map(r => [
      escapeCsv(r._id || r.id),
      escapeCsv(r.fullName),
      escapeCsv(r.email),
      escapeCsv(r.whatsapp),
      escapeCsv(r.country),
      escapeCsv(r.fee),
      escapeCsv(r.stuckArea),
      escapeCsv(r.liveCommit),
      escapeCsv(r.goDeeper),
      escapeCsv(r.status),
      escapeCsv(r.registeredAt),
      escapeCsv(r.notes)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="narayan_registrations_${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to export CSV.' });
  }
});

// Serve Admin Dashboard at /admin (Production)
const adminDist = path.join(__dirname, '../admin/dist');
if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist));
  app.get(/^\/admin(?:\/.*)?$/, (req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
}

// Serve Landing Page at / (Production)
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Server and connect MongoDB
app.listen(PORT, async () => {
  console.log(`✨ [Narayan Backend Server] running on http://localhost:${PORT}`);
  await connectMongoDB();
});
