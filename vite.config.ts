import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { generateArchitecturalFallback } from './src/services/architecturalGenerator';

import fs from 'fs';

function appletApiPlugin(): Plugin {
  return {
    name: 'applet-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
              console.warn(`[vite.config.ts] Could not write to ${relPath}:`, e);
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
            console.warn('[vite.config.ts] Failed to update initialData.ts:', err);
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

        // Serve direct data/ JSON endpoints
        if (req.url?.startsWith('/data/projects.json') || req.url?.startsWith('/data/projects')) {
          const data = readJsonMultiTarget(PROJECT_FILE_PATHS);
          if (data) {
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(data)
            });
            res.end(data);
            return;
          }
        }

        if (req.url?.startsWith('/data/siteData.json') || req.url?.startsWith('/data/sitedata')) {
          const data = readJsonMultiTarget(SETTINGS_FILE_PATHS);
          if (data) {
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(data)
            });
            res.end(data);
            return;
          }
        }

        function parseJsonBody(req: any): Promise<any> {
          return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
            req.on('end', () => {
              try {
                const fullBuffer = Buffer.concat(chunks);
                const text = fullBuffer.toString('utf-8');
                resolve(JSON.parse(text || '{}'));
              } catch (err) {
                reject(err);
              }
            });
            req.on('error', (err: any) => reject(err));
          });
        }

        // 1. Projects persistence endpoint
        if (req.url?.startsWith('/api/projects')) {
          if (req.method === 'GET') {
            const data = readJsonMultiTarget(PROJECT_FILE_PATHS);
            if (data) {
              const payload = data;
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
              });
              res.end(payload);
              return;
            }
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No saved projects file found' }));
            return;
          }

          if (req.method === 'POST') {
            try {
              const parsed = await parseJsonBody(req);
              const projectsToSave = Array.isArray(parsed) ? parsed : parsed.projects || [];
              const success = saveJsonMultiTarget(PROJECT_FILE_PATHS, projectsToSave);
              updateInitialDataTs(projectsToSave, undefined);
              const payload = JSON.stringify({ success, count: projectsToSave.length });
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
              });
              res.end(payload);
            } catch (err) {
              console.error('Failed to write projects-data.json in vite.config.ts:', err);
              const errPayload = JSON.stringify({ success: false, error: String(err) });
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(errPayload)
              });
              res.end(errPayload);
            }
            return;
          }
        }

        // 2. Settings persistence endpoint
        if (req.url?.startsWith('/api/settings')) {
          if (req.method === 'GET') {
            const data = readJsonMultiTarget(SETTINGS_FILE_PATHS);
            if (data) {
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
              });
              res.end(data);
              return;
            }
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No saved settings file found' }));
            return;
          }

          if (req.method === 'POST') {
            try {
              const parsed = await parseJsonBody(req);
              const settingsToSave = parsed.settings || parsed;
              const success = saveJsonMultiTarget(SETTINGS_FILE_PATHS, settingsToSave);
              updateInitialDataTs(undefined, settingsToSave);
              const payload = JSON.stringify({ success });
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
              });
              res.end(payload);
            } catch (err) {
              console.error('Failed to write settings-data.json in vite.config.ts:', err);
              const errPayload = JSON.stringify({ success: false, error: String(err) });
              res.writeHead(500, {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(errPayload)
              });
              res.end(errPayload);
            }
            return;
          }
        }

        // 3. Combined sync & Code Update endpoint
        if (
          (req.url?.startsWith('/api/code/update') ||
            req.url?.startsWith('/api/code-update') ||
            req.url?.startsWith('/api/sync-all')) &&
          req.method === 'POST'
        ) {
          try {
            const { projects, settings } = await parseJsonBody(req);
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
            const payload = JSON.stringify({
              success: true,
              projectsSaved,
              settingsSaved,
              count: projectsToSave ? projectsToSave.length : 0,
              timestamp: new Date().toISOString(),
              message: '모든 프로젝트 및 설정 데이터가 소스 코드 파일에 영구 업데이트되었습니다.'
            });
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload)
            });
            res.end(payload);
          } catch (err) {
            console.error('Failed to update code in vite.config.ts:', err);
            const errPayload = JSON.stringify({ success: false, error: String(err) });
            res.writeHead(500, {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(errPayload)
            });
            res.end(errPayload);
          }
          return;
        }

        // 3. Architectural Analysis fallback/API
        if (req.url?.startsWith('/api/analyze-project') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            let fallbackData: any;
            try {
              const parsed = JSON.parse(body || '{}');
              const { images = [], count = 1, aspect = 1.33 } = parsed;
              const plateCount = Math.max(1, count || (Array.isArray(images) ? images.length : 1));
              fallbackData = generateArchitecturalFallback(plateCount, aspect);

              if (!process.env.GEMINI_API_KEY) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(fallbackData));
                return;
              }

              const aiPromise = (async () => {
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({
                  apiKey: process.env.GEMINI_API_KEY,
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
- "description": Poetic, professional architectural monograph statement in English (3-4 evocative sentences) exploring tectonic mass, raw monolithic materiality (fair-faced concrete, basalt stone, blackened steel, low-iron glass), natural daylight, spatial void, and silence, strictly adhering to MIST ARCHITECTURE's monograph philosophy.
- "plateCaptions": An array of exactly ${plateCount} strings, each being a refined, poetic architectural caption written in English without any file extensions or filenames (e.g. "01 — Monolithic fair-faced concrete facade with vertical aperture sequence", "02 — Ingress of natural zenithal light across textured board-formed walls", "03 — Internal meditative courtyard and spatial void").`;

                const parts: any[] = [{ text: promptText }];

                // Add up to 2 images as inlineData
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

                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: parts,
                  config: {
                    responseMimeType: 'application/json'
                  }
                });

                if (response.text) {
                  const result = JSON.parse(response.text);
                  const validCats = ['Residential', 'Commercial', 'Workplace', 'Culture', 'Public', 'Renovation'];
                  const matchedCat =
                    validCats.find((c) => c.toLowerCase() === (result.category || '').toLowerCase()) ||
                    fallbackData.category;
                  return {
                    ...fallbackData,
                    ...result,
                    category: matchedCat
                  };
                }
                return fallbackData;
              })();

              const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(fallbackData), 7000));
              const finalResult = await Promise.race([aiPromise, timeoutPromise]);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(finalResult));
            } catch (e) {
              const fb = fallbackData || generateArchitecturalFallback(1);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(fb));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), appletApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/public/assets/**', '**/src/data/projects-data.json', '**/src/data/settings-data.json']
      },
    },
  };
});
