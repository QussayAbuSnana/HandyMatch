// Allow importing CSS files as side-effects (e.g. import "./globals.css")
declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}
