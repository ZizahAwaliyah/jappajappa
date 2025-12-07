import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.toLowerCase().trim();
    const type = searchParams.get("type") || "all"; // Filter: 'event', 'wisata', atau 'all'

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search Events (jika type === 'event' atau 'all')
    if (type === "event" || type === "all") {
      try {
        const eventsRef = collection(db, "events");
        const eventsSnap = await getDocs(eventsRef);
        
        eventsSnap.forEach((doc) => {
          const data = doc.data();
          // Handle multiple possible field names - prioritize 'title' yang actual di database
          const title = data.title || data.name || data.eventName || "";
          const location = data.location || data.place || data.venue || "";
          const description = data.description || data.desc || "";
          const image = data.image || data.flyer || data.poster || data.cover || "";
          
          // Search in title, location, dan description
          if (
            title.toLowerCase().includes(q) ||
            location.toLowerCase().includes(q) ||
            description.toLowerCase().includes(q)
          ) {
            results.push({
              id: doc.id,
              title: title,
              location: location,
              image: image,
              date: data.date || data.startDate,
              type: "event",
            });
          }
        });
      } catch (error) {
        console.error("Error searching events:", error);
      }
    }

    // Search Wisata (jika type === 'wisata' atau 'all')
    if (type === "wisata" || type === "all") {
      try {
        const wisataRef = collection(db, "wisata");
        const wisataSnap = await getDocs(wisataRef);
        
        wisataSnap.forEach((doc) => {
          const data = doc.data();
          // Handle multiple possible field names - prioritize 'title' yang actual di database
          const title = data.title || data.name || data.wisataName || "";
          const location = data.location || data.place || data.city || "";
          const description = data.description1 || data.description || data.desc || "";
          const image = data.image || data.mainImage || data.photos?.[0] || data.photo || data.cover || "";
          
          // Search in title, location, dan description
          if (
            title.toLowerCase().includes(q) ||
            location.toLowerCase().includes(q) ||
            description.toLowerCase().includes(q)
          ) {
            results.push({
              id: doc.id,
              title: title,
              location: location,
              image: image,
              type: "wisata",
            });
          }
        });
      } catch (error) {
        console.error("Error searching wisata:", error);
      }
    }

    // Sort results - events first (jika all), kemudian wisata
    const sortedResults = type === "all" 
      ? [
          ...results.filter(r => r.type === "event"),
          ...results.filter(r => r.type === "wisata")
        ]
      : results;

    return NextResponse.json({ results: sortedResults.slice(0, 20) });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
