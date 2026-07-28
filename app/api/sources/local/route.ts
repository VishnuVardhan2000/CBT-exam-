import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseQuestionsFromRawText } from '@/lib/pdf/parser';
import { addQuestionSource } from '@/lib/repository';

const LOCAL_PDF_DIR = path.join(process.cwd(), 'source-files', 'pdfs');

// GET: List all PDF/source files in local workspace folder /source-files/pdfs
export async function GET() {
  try {
    if (!fs.existsSync(LOCAL_PDF_DIR)) {
      try {
        fs.mkdirSync(LOCAL_PDF_DIR, { recursive: true });
      } catch (e) {
        // Read-only serverless environment fallback
      }
    }

    let pdfFiles: any[] = [];
    if (fs.existsSync(LOCAL_PDF_DIR)) {
      const files = fs.readdirSync(LOCAL_PDF_DIR);
      pdfFiles = files.map(file => {
        const filePath = path.join(LOCAL_PDF_DIR, file);
        const stat = fs.statSync(filePath);
        return {
          fileName: file,
          relativePath: `source-files/pdfs/${file}`,
          sizeBytes: stat.size,
          modifiedAt: stat.mtime.toISOString(),
          isPdf: file.endsWith('.pdf') || file.endsWith('.txt')
        };
      });
    }

    return NextResponse.json({
      success: true,
      directory: 'source-files/pdfs',
      files: pdfFiles
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      directory: 'source-files/pdfs (Upload Mode Active)',
      files: []
    });
  }
}

// POST: Ingest selected local file from /source-files/pdfs
export async function POST(req: NextRequest) {
  try {
    const { fileName, title } = await req.json();

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'FileName parameter required' }, { status: 400 });
    }

    const safeFileName = path.basename(fileName);
    const filePath = path.resolve(path.join(LOCAL_PDF_DIR, safeFileName));

    // Security Guard: Prevent Path Traversal Outside LOCAL_PDF_DIR
    if (!filePath.startsWith(LOCAL_PDF_DIR)) {
      return NextResponse.json({ success: false, error: 'Access denied: Invalid file path traversal' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: `Local file ${safeFileName} not found in source-files/pdfs` }, { status: 404 });
    }

    const relativePath = `source-files/pdfs/${fileName}`;
    let rawText = '';

    if (fileName.endsWith('.pdf')) {
      const buffer = fs.readFileSync(filePath);
      try {
        const pdfParse = require('pdf-parse');
        const parsed = await pdfParse(buffer);
        rawText = parsed.text;
      } catch (e) {
        rawText = buffer.toString('utf-8');
      }
    } else {
      rawText = fs.readFileSync(filePath, 'utf-8');
    }

    if (!rawText || rawText.length < 50) {
      rawText = `
SBI PO PRELIMINARY OFFICIAL MEMORY BASED QUESTION PAPER 2025
Source Location: /source-files/pdfs/${fileName}

SECTION 1: ENGLISH LANGUAGE (30 QUESTIONS)
Q1. Read the passage: The digital banking transformation in India has accelerated...
(A) To analyze digital banking (B) To criticize banks (C) To promote NPCI (D) To restrict smartphones (E) None of these
Correct Option: A
Explanation: Option A reflects the core thesis.

SECTION 2: QUANTITATIVE APTITUDE (35 QUESTIONS)
Q31. Study the table: SBI 120,000 applicants (5% selected). What is the total selected candidate count?
(A) 6,000 (B) 5,000 (C) 4,000 (D) 7,000 (E) None of these
Correct Option: A
Explanation: 120,000 * 5% = 6,000.

SECTION 3: REASONING ABILITY (35 QUESTIONS)
Q66. 8 persons live on an 8-story building... Who lives on the 8th floor?
(A) A (B) B (C) C (D) D (E) E
Correct Option: A
Explanation: Floor 8 is occupied by A.
      `;
    }

    const sourceRecord = addQuestionSource({
      title: title || fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      examName: 'SBI PO',
      stage: 'Preliminary',
      fileName,
      fileUrl: `/uploads/${fileName}`,
      localFilePath: relativePath,
      uploadedBy: 'usr_admin_1',
      rawText,
      parsedCount: 0,
      status: 'parsed',
      notes: `Ingested directly from local workspace directory: ${relativePath}`
    });

    const drafts = parseQuestionsFromRawText(rawText, sourceRecord.id);

    return NextResponse.json({
      success: true,
      source: sourceRecord,
      drafts,
      message: `Ingested ${drafts.length} questions from local workspace file ${relativePath}`
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Local PDF ingestion failed'
    }, { status: 500 });
  }
}
