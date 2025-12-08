import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Query tickets dari Firestore
    const ticketsRef = collection(db, "tickets");
    const q = query(
      ticketsRef,
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Timestamp to ISO string
        purchasedAt: doc.data().purchasedAt?.toDate().toISOString(),
      }))
      // Sort by purchasedAt desc in JavaScript (client-side sorting)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.purchasedAt || 0).getTime();
        const dateB = new Date(b.purchasedAt || 0).getTime();
        return dateB - dateA;
      });

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
