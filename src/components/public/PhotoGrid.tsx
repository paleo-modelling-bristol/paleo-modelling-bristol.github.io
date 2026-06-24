import Image from "next/image";
import type { EventPhoto } from "@/lib/types";

export function PhotoGrid({
  photos,
  alt,
}: {
  photos: EventPhoto[];
  alt: string;
}) {
  if (photos.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <figure
          key={photo.id}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-2"
        >
          <Image
            src={photo.imageUrl}
            alt={photo.caption ?? alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {photo.caption ? (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {photo.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
