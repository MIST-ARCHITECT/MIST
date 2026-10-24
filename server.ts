import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateArchitecturalFallback } from './src/services/architecturalGenerator.js';

import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Multi-target persistence helper functions to guarantee data survives app remix
function saveJsonMultiTarget(relativePathList: string[], data: any): boolean {
  let ok = false;
  const jsonStr = JSON.stringify(data, null, 2);
  for (const relPath of relativePathList) {
    try {
      const fullPath = path.resolve(__dirname, relPath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, jsonStr, 'utf-8');
      ok = true;
    } catch (e) {
      console.warn(`[server.ts] Could not write to ${relPath}:`, e);
    }
  }
  return ok;
}

function readJsonMultiTarget(relativePathList: string[]): string | null {
  for (const relPath of relativePathList) {
    try {
      const fullPath = path.resolve(__dirname, relPath);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf-8');
      }
    } catch {}
  }
  return null;
}

function updateInitialDataTs(projects?: any[], settings?: any) {
  try {
    const initialDataPath = path.resolve(__dirname, 'src/data/initialData.ts');
    if (!fs.existsSync(initialDataPath)) return;
    let code = fs.readFileSync(initialDataPath, 'utf-8');

    const nowIso = new Date().toISOString();
    const timestampComment = `// AUTO_GENERATED_BY_ADMIN_CODE_UPDATE: ${nowIso}`;
    if (code.includes('// AUTO_GENERATED_BY_ADMIN_CODE_UPDATE:')) {
      code = code.replace(/\/\/ AUTO_GENERATED_BY_ADMIN_CODE_UPDATE:.*/, timestampComment);
    } else {
      code = `${timestampComment}\n` + code;
    }

    fs.writeFileSync(initialDataPath, code, 'utf-8');
  } catch (err) {
    console.warn('[server.ts] Failed to update initialData.ts:', err);
  }
}

const PROJECT_FILE_PATHS = [
  'data/projects.json',
  'public/data/projects.json',
  'public/assets/projects-data.json',
  'src/data/projects-data.json',
  'dist/assets/projects-data.json'
];

const SETTINGS_FILE_PATHS = [
  'data/siteData.json',
  'public/data/siteData.json',
  'public/assets/settings-data.json',
  'src/data/settings-data.json',
  'dist/assets/settings-data.json'
];

// Direct data endpoints for JSON files
app.get('/data/projects.json', (req, res) => {
  const data = readJsonMultiTarget(PROJECT_FILE_PATHS);
  if (data) {
    return res.status(200).type('application/json').send(data);
  }
  return res.status(404).json({ error: 'data/projects.json not found' });
});

app.get('/data/siteData.json', (req, res) => {
  const data = readJsonMultiTarget(SETTINGS_FILE_PATHS);
  if (data) {
    return res.status(200).type('application/json').send(data);
  }
  return res.status(404).json({ error: 'data/siteData.json not found' });
});

// 1. Projects persistence endpoint
app.get('/api/projects', (req, res) => {
  const data = readJsonMultiTarget(PROJECT_FILE_PATHS);
  if (data) {
    return res.status(200).type('application/json').send(data);
  }
  return res.status(404).json({ error: 'No saved projects file found' });
});

app.post('/api/projects', (req, res) => {
  try {
    const projectsToSave = Array.isArray(req.body) ? req.body : req.body?.projects || [];
    const success = saveJsonMultiTarget(PROJECT_FILE_PATHS, projectsToSave);
    updateInitialDataTs(projectsToSave, undefined);
    return res.status(200).json({ success, count: projectsToSave.length });
  } catch (err) {
    console.error('Failed to write projects-data.json in server.ts:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// 2. Settings persistence endpoint
app.get('/api/settings', (req, res) => {
  const data = readJsonMultiTarget(SETTINGS_FILE_PATHS);
  if (data) {
    return res.status(200).type('application/json').send(data);
  }
  return res.status(404).json({ error: 'No saved settings file found' });
});

app.post('/api/settings', (req, res) => {
  try {
    const settingsToSave = req.body?.settings || req.body;
    const success = saveJsonMultiTarget(SETTINGS_FILE_PATHS, settingsToSave);
    updateInitialDataTs(undefined, settingsToSave);
    return res.status(200).json({ success });
  } catch (err) {
    console.error('Failed to write settings-data.json in server.ts:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// 3. Combined sync & Code Update endpoint
app.post(['/api/sync-all', '/api/code/update', '/api/code-update'], (req, res) => {
  try {
    const { projects, settings } = req.body || {};
    let projectsSaved = false;
    let settingsSaved = false;
    let projectsToSave: any[] | undefined;
    let settingsToSave: any | undefined;
    if (projects) {
      projectsToSave = Array.isArray(projects) ? projects : projects?.projects || [];
      projectsSaved = saveJsonMultiTarget(PROJECT_FILE_PATHS, projectsToSave);
    }
    if (settings) {
      settingsToSave = settings?.settings || settings;
      settingsSaved = saveJsonMultiTarget(SETTINGS_FILE_PATHS, settingsToSave);
    }
    updateInitialDataTs(projectsToSave, settingsToSave);
    return res.status(200).json({
      success: true,
      projectsSaved,
      settingsSaved,
      count: projectsToSave ? projectsToSave.length : 0,
      timestamp: new Date().toISOString(),
      message: '모든 프로젝트 및 설정 데이터가 소스 코드 파일에 영구 업데이트되었습니다.'
    });
  } catch (err) {
    console.error('Failed to update code in server.ts:', err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Gemini AI analysis endpoint
app.post('/api/analyze-project', async (req, res) => {
  const { images = [], count = 1, aspect = 1.33 } = req.body || {};
  const plateCount = Math.max(1, count || (Array.isArray(images) ? images.length : 1));
  const fallbackData = generateArchitecturalFallback(plateCount, aspect);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json(fallbackData);
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const promptText = `You are a principal architect and curator at MIST ARCHITECTURE (Minimal + Structure & Space).
Analyze the architectural images and generate complete monograph project data.
Return a JSON object with:
- "title": Evocative, monumental architectural title in English uppercase (e.g. "BASALT MONOLITH RESIDENCE", "URBAN CANOPY PAVILION", etc.)
- "typology": Architectural typology in format like "RESIDENTIAL / DETACHED VILLA", "COMMERCIAL / SHOWROOM", "WORKPLACE / HEADQUARTERS", "CULTURE / CONTEMPORARY GALLERY", "PUBLIC / CIVIC PAVILION", or "RENOVATION / ADAPTIVE REUSE"
- "category": Strictly ONE of ["Residential", "Commercial", "Workplace", "Culture", "Public", "Renovation"]
- "year": Recent year (e.g. "2024" or "2025")
- "location": Architectural location in South Korea (e.g. "Seoul, Gangnam-gu", "Gyeonggi-do, Yangpyeong", "Jeju Island, Aewol", etc.)
- "scaleGfa": Architectural scale with unit (e.g. "480 m²", "1,200 m²", etc.)
- "aspect": Card aspect ratio ("aspect-[3/4]" or "aspect-[16/9]" or "aspect-[4/3]" or "aspect-[2/3]" or "aspect-[2/1]" or "aspect-square")
- "description": Poetic, professional architectural monograph statement in English (3-4 evocative sentences) exploring tectonic mass, raw monolithic materiality (fair-faced concrete, basalt stone, blackened steel, low-iron glass), natural daylight, spatial void, and silence, strictly adhering to MIST ARCHITECTURE's monograph philosophy.
- "plateCaptions": An array of exactly ${plateCount} strings, each being a refined, poetic architectural caption written in English without any file extensions or filenames (e.g. "01 — Monolithic fair-faced concrete facade with vertical aperture sequence", "02 — Ingress of natural zenithal light across textured board-formed walls", "03 — Internal meditative courtyard and spatial void").`;

    const parts: any[] = [{ text: promptText }];

    if (Array.isArray(images)) {
      for (let i = 0; i < Math.min(2, images.length); i++) {
        const img = images[i];
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          const match = img.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inlineData: {
                mimeType: match[1],
                data: match[2]
              }
            });
          }
        }
      }
    }

    const aiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const response = await Promise.race([aiPromise, timeoutPromise]);

    if (response && 'text' in response && response.text) {
      const result = JSON.parse(response.text);
      const validCats = ['Residential', 'Commercial', 'Workplace', 'Culture', 'Public', 'Renovation'];
      const matchedCat =
        validCats.find((c) => c.toLowerCase() === (result.category || '').toLowerCase()) ||
        fallbackData.category;
      return res.json({
        ...fallbackData,
        ...result,
        category: matchedCat
      });
    }

    return res.json(fallbackData);
  } catch (error) {
    console.error('Server Gemini analysis error:', error);
    return res.json(fallbackData);
  }
});

// Serve static frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
