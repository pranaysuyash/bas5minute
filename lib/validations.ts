import { z } from 'zod';

export const geocodeSchema = z.object({
  address: z.string().min(2).max(200),
});

export const reverseGeocodeSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const isochroneSchema = z.object({
  profile: z.enum(['driving-car', 'cycling-regular', 'foot-walking']),
  locations: z.array(z.array(z.number()).length(2)).length(1),
  range: z.array(z.number().positive()).min(1).max(3),
  smoothing: z.number().min(0).max(50).optional(),
  provider: z.enum(['auto', 'ors', 'valhalla', 'custom']).optional(),
});

export const orderSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  theme: z.enum(['bollywood', 'monsoon', 'sandstone', 'neon']),
  caption: z.string().max(200).optional(),
  format: z.enum(['social-square', 'story-vertical', 'poster-a4', 'poster-a3', 'transparent-png']),
  quantity: z.number().int().min(1).max(100).default(1),
  useCase: z.enum(['personal', 'gift', 'business']),
  customText: z.string().max(1000).optional(),
});

export const licenseActivateSchema = z.object({
  key: z.string().regex(/^B5M-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid license key format'),
  email: z.string().email('Invalid email address'),
});

export const aiCaptionSchema = z.object({
  location: z.string().min(2).max(200),
  city: z.string().max(100).optional(),
  mode: z.enum(['driving', 'walking', 'cycling']),
  duration: z.number().int().min(5).max(60),
  theme: z.enum(['bollywood', 'monsoon', 'sandstone', 'neon']),
  style: z.enum(['sarcastic', 'humorous', 'poetic', 'minimal', 'reality-check']),
  provider: z.enum(['auto', 'huggingface', 'gemini', 'openai', 'anthropic', 'local']).optional(),
});

export const roadNetworkSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().int().min(100).max(5000).default(1000),
  mode: z.enum(['driving', 'walking', 'cycling']).optional(),
});

export const routeSchema = z.object({
  start: z.array(z.number()).length(2),
  end: z.array(z.number()).length(2),
  profile: z.enum(['driving-car', 'cycling-regular', 'foot-walking']).optional(),
});

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

export function safeValidateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    error: result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ') 
  };
}
