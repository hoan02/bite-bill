import { z } from 'zod';

export const orgConstraints = {
  name: {
    min: 3,
    max: 64,
  },
  slug: {
    min: 3,
    max: 64,
  },
  logo: {
    max: 4000,
  },
  joinCodeLength: 8,
};

export const orgSchema = z.object({
  name: z
    .string()
    .min(orgConstraints.name.min, 'Tên phải có ít nhất 3 ký tự')
    .max(orgConstraints.name.max, 'Tên không được vượt quá 64 ký tự'),
  slug: z
    .string()
    .min(orgConstraints.slug.min, 'Slug phải có ít nhất 3 ký tự')
    .max(orgConstraints.slug.max, 'Slug không được vượt quá 64 ký tự')
    .optional(),
  logo: z.string().max(orgConstraints.logo.max).optional(),
  joinCode: z
    .string()
    .length(orgConstraints.joinCodeLength, 'Join code phải có đúng 8 ký tự'),
  description: z.string().max(512).optional(),
  metadata: z.string().optional(),
});

export type OrgFormData = z.infer<typeof orgSchema>;
