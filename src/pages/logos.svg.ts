import type { APIRoute } from 'astro';
import { logoSprite } from '../lib/logos';

// Built once: every logo as a <symbol>, referenced from the pages with <use>.
export const GET: APIRoute = () =>
  new Response(logoSprite(), { headers: { 'Content-Type': 'image/svg+xml' } });
