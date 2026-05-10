import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Upload PDF document
// @route POST /api/documents/upload
// @access Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF file",
        statusCode: 400,
      });
    }

    const { title } = req.body;

    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "Please provide a document title",
        statusCode: 400,
      });
    }

    // Build file URL (use http not https for local dev)
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing",
    });

    console.log(
      `[uploadDocument] Document created with ID: ${document._id}. Starting background PDF processing...`
    );
    console.log(`[uploadDocument] Local file path for processing: ${req.file.path}`);

    // Process PDF in background — pass the actual local disk path
    processPDF(document._id, req.file.path).catch((err) => {
      console.error("[uploadDocument] Unhandled PDF processing error:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully. Processing in progress...",
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

// Helper function to process PDF in background
const processPDF = async (documentId, filePath) => {
  console.log(`[processPDF] Starting processing for document: ${documentId}`);
  console.log(`[processPDF] File path: ${filePath}`);

  try {
    // Verify file exists before parsing
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not accessible at path: ${filePath}`);
    }

    console.log(`[processPDF] File verified, starting text extraction...`);
    const { text, numPages } = await extractTextFromPDF(filePath);

    if (!text || text.trim().length === 0) {
      console.warn(
        `[processPDF] PDF parsed but no text extracted from document ${documentId}. The PDF may be image-based.`
      );
      // Still mark as ready, just with empty text
      await Document.findByIdAndUpdate(documentId, {
        extractedText: "",
        chunks: [],
        status: "ready",
        processingError: "No text could be extracted (possibly image-based PDF)",
      });
      console.log(
        `[processPDF] Document ${documentId} marked as ready (no extractable text).`
      );
      return;
    }

    console.log(
      `[processPDF] Text extracted: ${text.length} chars, ${numPages} pages. Chunking...`
    );
    const chunks = chunkText(text, 500, 50);
    console.log(`[processPDF] Created ${chunks.length} chunks.`);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
      processingError: null,
    });

    console.log(`[processPDF] ✅ Document ${documentId} processed successfully.`);
  } catch (error) {
    console.error(
      `[processPDF] ❌ Error processing document ${documentId}:`,
      error.message
    );
    console.error(error.stack);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
      processingError: error.message,
    });
  }
};

// @desc Get all documents for the authenticated user
// @route GET /api/documents
// @access Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get a single document by ID
// @route GET /api/documents/:id
// @access Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    // Get counts of associated flashcards and quizzes
    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });
    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    // Update last accessed
    document.lastAccessed = Date.now();
    await document.save();

    // Combine document data with counts
    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete a document
// @route DELETE /api/documents/:id
// @access Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
        statusCode: 404,
      });
    }

    // Extract filename from filePath URL and build local filesystem path
    const urlParts = document.filePath.split("/uploads/documents/");
    if (urlParts.length > 1) {
      const fileName = urlParts[1];
      const actualPath = path.join(
        __dirname,
        "..",
        "uploads",
        "documents",
        fileName
      );
      console.log(`[deleteDocument] Removing file: ${actualPath}`);
      await fs.unlink(actualPath).catch((err) => {
        console.warn(`[deleteDocument] Could not delete file: ${err.message}`);
      });
    }

    // Delete associated flashcards and quizzes
    await Flashcard.deleteMany({ documentId: document._id });
    await Quiz.deleteMany({ documentId: document._id });

    // Delete document record
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
