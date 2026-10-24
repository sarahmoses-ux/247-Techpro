import ffmpeg from 'ffmpeg-static';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Render a locally hosted, silent cinematic montage from the existing illustrative assets.
// The final shot returns to the first framing for a gentle loop.
mkdirSync('public/video', { recursive: true });
const shot = (input, zoom) => `[${input}:v]scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,zoompan=z='${zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=192:s=1280x720:fps=24,trim=duration=8,setpts=PTS-STARTPTS,format=yuv420p[v${input}]`;
const filter = [shot(0, '1+0.0004*on'), shot(1, '1.02+0.00035*on'), shot(2, '1.0764-0.0004*on'), '[v0][v1]xfade=transition=fade:duration=1:offset=7[v01]', '[v01][v2]xfade=transition=fade:duration=1:offset=14[out]'].join(';');
const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'warning', '-i', 'src/assets/technology-studio.jpg', '-i', 'src/assets/connected-technology.jpg', '-i', 'src/assets/technology-studio.jpg', '-filter_complex_threads', '2', '-filter_complex', filter, '-map', '[out]', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', '24', '-profile:v', 'main', '-level', '3.1', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', '22', 'public/video/technology-living.mp4'], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log('Created public/video/technology-living.mp4 — 22 seconds, 1280 × 720, 24 fps, no audio.');
