import { supabase } from '../lib/supabase'

const bannerFiles = [
  'rosa-banner-01.webp',
  'rosa-banner-02.webp',
  'rosa-banner-03.webp',
  'rosa-banner-04.webp',
]

export default function Ban() {
  const client = supabase
  if (!client) return null

  const banners = bannerFiles.map((file, index) => ({
    file,
    src: client.storage.from('ban').getPublicUrl(file).data.publicUrl,
    alt: `ROSA Beauty promotional banner ${index + 1}`,
  }))

  return (
    <section
      aria-label="ROSA Beauty banners"
      className="mx-auto mt-8 w-full max-w-7xl px-4 sm:mt-10"
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {banners.map((banner) => (
          <div
            key={banner.file}
            className="overflow-hidden rounded-xl"
          >
            <img
              src={banner.src}
              alt={banner.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
