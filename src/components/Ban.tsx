import { supabase } from '../lib/supabase'

const bannerFiles = [
  'rosa-banner-01.webp',
  'rosa-banner-02.webp',
  'rosa-banner-03.webp',
  'rosa-banner-04.webp',
]

export default function Ban() {
  if (!supabase) return null

  const banners = bannerFiles.map((file, index) => ({
    file,
    src: supabase.storage.from('ban').getPublicUrl(file).data.publicUrl,
    alt: `ROSA Beauty promotional banner ${index + 1}`,
  }))

  return (
    <section
      aria-label="ROSA Beauty banners"
      className="mx-auto mt-10 w-full max-w-7xl px-4 sm:mt-12"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {banners.map((banner) => (
          <div
            key={banner.file}
            className="group overflow-hidden rounded-2xl bg-[#f7f1ed]"
          >
            <img
              src={banner.src}
              alt={banner.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
