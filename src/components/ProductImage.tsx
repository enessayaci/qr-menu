import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** fill parent with absolute positioning */
  fill?: boolean;
};

/**
 * Uploaded product photos are stored under /uploads and change at runtime.
 * next/image optimization often 404s those in Docker standalone — use a plain img.
 */
export function ProductImage({ src, alt, className, fill }: Props) {
  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("object-cover", className)} />
  );
}
