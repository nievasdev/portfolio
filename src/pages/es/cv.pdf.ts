import type { APIRoute } from 'astro';
import { cvResponse } from '../../lib/cv-route';

export const GET: APIRoute = () => cvResponse('es');
