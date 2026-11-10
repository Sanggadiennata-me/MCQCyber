import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/questions/loader';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Gagal memuat kategori soal.' },
      { status: 500 }
    );
  }
}
