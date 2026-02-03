import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number
): number => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      );
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<Set<string>> => {
  const failed = new Set<string>();
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => {
            failed.add(src);
            resolve();
          };
        })
    )
  );
  return failed;
};

// ... (interfaces remain same)

const Masonry: React.FC<MasonryProps> = ({
  items,
  // ... (props remain same)
}) => {
  // ... (useMedia hook usage remains same)

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // ... (getInitialPosition logic remains same)

  useEffect(() => {
    setImagesReady(false);
    preloadImages(items.map((i) => i.img)).then((failed) => {
      setFailedImages(failed);
      setImagesReady(true);
    });
  }, [items]);

  // ... (grid memo and useLayoutEffect remain same)

  // ... (mouse handlers remain same)

  return (
    <div
      ref={containerRef}
    // ... (container props remain same)
    >
      {grid.map((item) => {
        const isFailed = failedImages.has(item.img);
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="absolute box-content cursor-pointer"
            style={{ willChange: "transform, width, height, opacity" }}
            onClick={() => !isFailed && onItemClick?.(item.id, item)}
            onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
            onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
          >
            {isFailed ? (
              <div className="relative w-full h-full bg-neutral-900 rounded-[10px] border border-white/10 flex flex-col items-center justify-center text-center p-4">
                <span className="text-2xl mb-2">⚠️</span>
                <span className="text-xs text-white/50 font-medium">Image Not Available</span>
              </div>
            ) : (
              <div
                className="relative w-full h-full bg-cover bg-center rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] uppercase text-[10px] leading-[10px] border border-solid border-[rgba(57,46,78,0.6)] card--border-glow overflow-hidden transition-shadow duration-300 hover:shadow-[0px_10px_50px_-5px_rgba(132,0,255,0.3)]"
                style={{ backgroundImage: `url(${item.img})` }}
              >
                {colorShiftOnHover && (
                  <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
                )}
              </div>
            )}
          </div>
        );
      })}
      <style>{`
        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: radial-gradient(600px circle at 50% 50%,
            rgba(132, 0, 255, 0.6) 0%,
            rgba(132, 0, 255, 0.3) 30%,
            transparent 60%
          );
          border-radius: 10px;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: subtract;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .card--border-glow:hover::after {
          opacity: 1;
        }

        .card--border-glow:hover {
          box-shadow: 0 4px 20px rgba(132, 0, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default Masonry;
