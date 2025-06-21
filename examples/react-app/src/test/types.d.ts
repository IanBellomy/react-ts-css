declare module 'react' {
  export = React;
  export as namespace React;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}