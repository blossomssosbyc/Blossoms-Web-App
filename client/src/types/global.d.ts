// Global type declarations for importing static assets in TypeScript

declare module "*.avif";
declare module "*.bmp";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.jfif";
declare module "*.pjpeg";
declare module "*.pjp";
declare module "*.png";
declare module "*.webp";
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.module.css";
declare module "*.module.scss";

declare module "*.css";
