# Data Attribute Hover Feature

This VS Code extension now supports peeking CSS styles for data attributes in React components.

## Overview

The data attribute hover feature allows you to hover over data attributes (like `data-testid`, `data-variant`, etc.) in your React components and see the corresponding CSS styles that target those attributes.

## How it Works

1. **Detection**: The extension parses your React components and detects data attributes in JSX elements
2. **CSS Matching**: It searches through your CSS modules for selectors that target the detected data attributes
3. **Hover Display**: When you hover over a data attribute, it shows you the matching CSS rules

## Example

```tsx
// React Component
function Button({ variant, size }) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      className={styles.button}
    >
      Click me
    </button>
  );
}
```

```css
/* CSS Module */
.button[data-variant="primary"] {
  background-color: #007bff;
  color: white;
}

.button[data-variant="primary"][data-size="large"] {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}
```

When you hover over `data-variant="primary"` in the JSX, you'll see the CSS rules that target that attribute.

## Supported Data Attributes

The feature works with any data attribute that starts with `data-`, including:
- `data-testid`
- `data-variant`
- `data-size`
- `data-state`
- `data-theme`
- `data-status`
- And any other custom data attributes

## Configuration

You can enable/disable this feature in your VS Code settings:

```json
{
  "reactTsScss.dataAttributeHover": true
}
```

## Requirements

- The feature requires both `reactTsScss.peekProperties` and `reactTsScss.dataAttributeHover` to be enabled
- CSS modules must contain selectors that target the data attributes
- The data attributes must be present in your JSX elements

## Limitations

- Only works with CSS modules (`.module.css`, `.module.scss`, `.module.less`)
- Requires the data attribute to be present in the JSX element
- CSS selectors must explicitly target the data attribute (e.g., `[data-testid="value"]`)

## Testing

To test the feature:

1. Open a React component with data attributes
2. Hover over any `data-*` attribute
3. You should see a tooltip showing the CSS styles that target that attribute

Example test files are provided in `examples/react-app/src/test/DataAttributeHoverTest.tsx` and `DataAttributeHoverTest.module.css`.