import Joi from "joi";

 const slugSchema = Joi.string()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .min(3)
  .max(100)
  .messages({
    "string.empty": "URL slug is required",
    "string.pattern.base": "Slug must be lowercase with hyphens only (e.g., product-name)",
    "string.min": "Slug must be at least 3 characters",
    "string.max": "Slug cannot exceed 100 characters",
  });

// Product creation validation
export const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    metaTitle: Joi.string().min(3).max(60).required().messages({
      "string.empty": "Meta title is required",
      "string.min": "Meta title must be at least 3 characters",
      "string.max": "Meta title cannot exceed 60 characters",
    }),
    productName: Joi.string().min(3).max(200).required().messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name cannot exceed 200 characters",
    }),
    slug: slugSchema.required(),
    price: Joi.number().min(0).max(1000000).required().precision(2).messages({
      "number.base": "Price must be a valid number",
      "number.min": "Price cannot be negative",
      "number.max": "Price seems unreasonably high",
      "any.required": "Price is required",
    }),
    discountedPrice: Joi.number()
      .min(0)
      .less(Joi.ref("price"))
      .precision(2)
      .optional()
      .messages({
        "number.base": "Discounted price must be a valid number",
        "number.min": "Discounted price cannot be negative",
        "number.less": "Discounted price must be less than regular price",
      }),
    description: Joi.string().min(10).max(5000).required().messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description cannot exceed 5000 characters",
    }),
    galleryImages: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          publicId: Joi.string().optional(),
          alt: Joi.string().max(200).optional(),
        })
      )
      .max(10)
      .optional()
      .messages({
        "array.max": "Cannot have more than 10 gallery images",
      }),
    isActive: Joi.boolean().optional().default(true),
    createdBy: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
      .required()
      .messages({
        "string.pattern.base": "Invalid creator ID format",
        "any.required": "Creator ID is required",
      }),
  }).options({ stripUnknown: true }); // Remove unknown fields

  const { error, value } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
      field: error.details[0].path[0],
    });
  }
  
  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

// Product update validation (all fields optional)
export const validateProductUpdate = (req, res, next) => {
  const schema = Joi.object({
    metaTitle: Joi.string().min(3).max(60).optional(),
    productName: Joi.string().min(3).max(200).optional(),
    slug: slugSchema.optional(),
    price: Joi.number().min(0).max(1000000).precision(2).optional(),
    discountedPrice: Joi.number().min(0).precision(2).optional(),
    description: Joi.string().min(10).max(5000).optional(),
    galleryImages: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          publicId: Joi.string().optional(),
          alt: Joi.string().max(200).optional(),
        })
      )
      .max(10)
      .optional(),
    isActive: Joi.boolean().optional(),
  })
    .min(1) // At least one field must be present
    .options({ stripUnknown: true });

  const { error, value } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
      field: error.details[0].path[0],
    });
  }
  
  // Validate discountedPrice against price if both present
  if (value.discountedPrice !== undefined && value.price !== undefined) {
    if (value.discountedPrice >= value.price) {
      return res.status(400).json({
        status: "fail",
        message: "Discounted price must be less than regular price",
      });
    }
  }
  
  req.body = value;
  next();
};