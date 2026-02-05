import DOMPurify from "isomorphic-dompurify";

export const sanitizeRichText = (dirtyHTML) => {
  if (!dirtyHTML || typeof dirtyHTML !== "string") {
    return "";
  }

  // Configure DOMPurify to allow common formatting tags from CKEditor
  const config = {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "figure",
      "figcaption",
      "span",
      "div",
    ],
    ALLOWED_ATTR: [
      "href",
      "title",
      "target",
      "rel",
      "src",
      "alt",
      "width",
      "height",
      "class",
      "style",
      "colspan",
      "rowspan",
    ],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  };

  return DOMPurify.sanitize(dirtyHTML, config);
};


export const validateRichText = (
  content,
  options = { minLength: 10, maxLength: 5000 },
) => {
  const errors = [];

  if (!content || typeof content !== "string") {
    errors.push("Description must be a valid string");
    return { isValid: false, errors };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length < options.minLength) {
    errors.push(
      `Description must be at least ${options.minLength} characters long`,
    );
  }

  if (trimmedContent.length > options.maxLength) {
    errors.push(`Description cannot exceed ${options.maxLength} characters`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const processRichText = (dirtyText) => {
  // Validate first
  const validation = validateRichText(dirtyText);

  if (!validation.isValid) {
    return {
      content: "",
      isValid: false,
      errors: validation.errors,
    };
  }

  // Sanitize after validation
  const cleanContent = sanitizeRichText(dirtyText);

  return {
    content: cleanContent,
    isValid: true,
    errors: [],
  };
};
