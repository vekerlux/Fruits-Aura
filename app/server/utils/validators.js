const { z } = require('zod');

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Valid image URL required").or(z.string().regex(/^data:image\/[a-z]+;base64,/, "Invalid base64 image")),
  category: z.enum(['detox', 'energy', 'wellness', 'refresh', 'immunity']),
  ingredients: z.array(z.string()).min(1, "At least one ingredient required").optional(),
  nutrition: z.object({
    kcal: z.number().nonnegative(),
    sugar: z.string(),
    vitC: z.string(),
    hydration: z.string(),
  }).optional(),
  subtext: z.string().optional(),
  cssFilter: z.string().optional(),
  isPopular: z.boolean().optional(),
  isVibrant: z.boolean().optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

module.exports = {
  productSchema,
  orderStatusSchema,
};
