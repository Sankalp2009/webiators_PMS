# Rich Text Editor (CKEditor) Integration - Server-Side Documentation

## Overview

The server now supports rich text HTML content from CKEditor in product descriptions. All HTML content is automatically sanitized for security before storage to prevent XSS attacks.

## What's Been Implemented

### 1. **HTML Sanitization Utility** (`Utils/sanitizer.js`)

A comprehensive sanitization module that processes and validates rich text content with the following features:

- **`sanitizeRichText(dirtyHTML)`** - Sanitizes HTML content and allows safe tags
  - Allowed tags: `<p>`, `<br>`, `<strong>`, `<em>`, `<u>`, headings, lists, links, images, tables, code blocks, etc.
  - Safe attributes: `href`, `src`, `alt`, `width`, `height`, `class`, `style`, etc.
  - Removes potentially dangerous scripts and event handlers

- **`validateRichText(content, options)`** - Validates content length and format
  - Default: 10-5000 characters
  - Custom limits can be specified via options

- **`processRichText(dirtyText)`** - Combined validation and sanitation
  - Returns object with: `{ content, isValid, errors }`
  - Validates before sanitizing for efficiency

### 2. **Updated Product Controller**

The `productController.js` now automatically sanitizes descriptions:

#### Create Product

```javascript
// Description is sanitized when product is created
const { content, isValid, errors } = processRichText(product.description);
if (!isValid) {
  throw new Error(`Invalid description: ${errors.join(", ")}`);
}
```

#### Update Product

```javascript
// Description is sanitized when product is updated
if (updateData.description) {
  const { content, isValid, errors } = processRichText(updateData.description);
  updateData.description = content;
}
```

### 3. **Updated Product Model**

The model now documents that description field supports rich HTML:

```javascript
description: {
  type: String,
  required: true,
  minlength: 10,
  maxlength: 5000,
  // Supports rich HTML content from CKEditor - automatically sanitized on server
}
```

## Security Features

✅ **XSS Prevention** - All HTML is sanitized to remove dangerous scripts  
✅ **Content Validation** - Length and format validation before processing  
✅ **Safe Tag Whitelist** - Only approved HTML tags are allowed  
✅ **Safe Attribute Filtering** - Only safe attributes pass through  
✅ **Automatic Processing** - Sanitization happens automatically in CRUD operations

## Allowed HTML Tags

The following HTML tags from CKEditor are preserved:

- **Formatting**: `<p>`, `<strong>`, `<em>`, `<u>`, `<code>`, `<pre>`
- **Headings**: `<h1>` through `<h6>`
- **Lists**: `<ul>`, `<ol>`, `<li>`
- **Quotes**: `<blockquote>`
- **Links**: `<a>` (with href, title, target, rel)
- **Media**: `<img>` (with src, alt, width, height)
- **Tables**: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- **Structural**: `<div>`, `<span>`, `<figure>`, `<figcaption>`

## API Usage Examples

### Create Product with Rich Text Description

**Request:**

```json
{
  "metaTitle": "Premium Laptop",
  "productName": "Latest Laptop Model",
  "slug": "latest-laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "createdBy": "user_id_here",
  "galleryImages": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Product image"
    }
  ],
  "description": "<h2>Product Features</h2><p>This laptop offers <strong>exceptional performance</strong> with:</p><ul><li>16GB RAM</li><li>512GB SSD</li><li>Intel Core i7</li></ul><p>Perfect for professionals!</p>"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "description": "<h2>Product Features</h2><p>This laptop offers <strong>exceptional performance</strong> with:</p><ul><li>16GB RAM</li><li>512GB SSD</li><li>Intel Core i7</li></ul><p>Perfect for professionals!</p>",
    ...
  }
}
```

### Update Product Description

**Request (PATCH):**

```json
{
  "description": "<p>Updated product description with <strong>new features</strong></p>"
}
```

### Client-Side Integration (CKEditor)

While the server-side processing is complete, on the client, you'll use CKEditor like this:

```jsx
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// In your ProductForm component:
<CKEditor
  editor={ClassicEditor}
  data={formData.description}
  onChange={(event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  }}
/>;
```

## Error Handling

If description exceeds length limits or contains invalid content:

**Response (400 Bad Request):**

```json
{
  "status": "fail",
  "message": "Invalid description",
  "errors": ["Description must be at least 10 characters long"]
}
```

## Testing

Product CRUD tests pass with the new sanitization:

- ✅ Create product with description
- ✅ Update product description
- ✅ Retrieve product with sanitized HTML
- ✅ Validate description length and format

Run tests:

```bash
npm run test
```

## Package Dependencies

- **`isomorphic-dompurify`** - Server-side HTML sanitization (v2.11.0)
- Works with Node.js and handles DOMPurify in server environment

Install if needed:

```bash
npm install isomorphic-dompurify
```

## Best Practices

1. **Rich Text Default** - Descriptions now support HTML by default
2. **Always Sanitize** - Server automatically sanitizes on every create/update
3. **Client Validation** - CKEditor handles client-side rich text editing
4. **Server Trust** - Server validates and sanitizes all incoming data
5. **Display Content** - All returned descriptions are safe to render as HTML

## Future Enhancements

- [ ] Add image upload support via CKEditor
- [ ] Add custom formatting styles via CSS classes
- [ ] Implement content versioning for descriptions
- [ ] Add description search with HTML-aware indexing
- [ ] Support markdown to HTML conversion option

## Support

For issues or questions about the rich text editor integration:

1. Check the sanitization utility: `Utils/sanitizer.js`
2. Review controller logic: `Controller/productController.js`
3. Check model schema: `Model/productModel.js`
