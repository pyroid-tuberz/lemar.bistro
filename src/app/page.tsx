import { readJson } from "@/lib/db";
import PageContent from "@/components/PageContent";

export const revalidate = 60;

export default async function Home() {
  // Pre-fetch all data on the server in parallel
  const [menuData, bgData, galleryData, artistsData, testimonialData] = await Promise.all([
    readJson('menu.json') || { items: [], categories: {} },
    readJson('backgrounds.json') || { sabah: "sabah.png", oglen: "oglen.jpg", aksam: "aksam.jpg", times: { sabah: 6, oglen: 12, aksam: 18 } },
    readJson('gallery.json') || { images: [] },
    readJson('artists.json') || [],
    readJson('testimonials.json') || []
  ]);

  // Determine background based on server time
  const currentHour = new Date().getHours();
  const times = bgData.times || { sabah: 6, oglen: 12, aksam: 18 };
  let timeSlot = 'aksam';
  if (currentHour >= times.sabah && currentHour < times.oglen) timeSlot = 'sabah';
  else if (currentHour >= times.oglen && currentHour < times.aksam) timeSlot = 'oglen';

  const bgUrl = bgData[timeSlot] || (timeSlot === 'sabah' ? 'sabah.png' : timeSlot === 'oglen' ? 'oglen.jpg' : 'aksam.jpg');

  // Filter gallery images by time slot
  const filteredGallery = (galleryData.images || []).filter((img: any) => img.times.includes(timeSlot));

  return (
    <PageContent
      menuData={menuData}
      bgData={bgData}
      galleryData={galleryData}
      artistsData={artistsData}
      testimonialData={testimonialData}
      timeSlot={timeSlot}
      bgUrl={bgUrl}
      filteredGallery={filteredGallery}
    />
  );
}
