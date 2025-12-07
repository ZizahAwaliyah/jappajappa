import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";

// POST - Tambah artikel baru
export async function POST(request: NextRequest) {
  try {
    const { title, content, image, category } = await request.json();

    // Validasi input
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, dan category harus diisi" },
        { status: 400 }
      );
    }

    // Simpan ke Firestore
    const docRef = await addDoc(collection(db, "jappa_posts"), {
      title,
      content,
      image: image || null,
      category, // "wisata" atau "event"
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { message: "Artikel berhasil dibuat", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Gagal membuat artikel" },
      { status: 500 }
    );
  }
}

// GET - Ambil semua artikel
export async function GET(request: NextRequest) {
  try {
    const q = query(
      collection(db, "jappa_posts"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Gagal mengambil artikel" },
      { status: 500 }
    );
  }
}
