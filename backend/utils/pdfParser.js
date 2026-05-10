import fs from "fs/promises";
import { createRequire } from "module";

// pdf-parse v1.x exports a direct function — use createRequire for CJS compat in ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extracts text content from a PDF file.
 * @param {string} filePath - The absolute path to the PDF file on disk.
 * @returns {Promise<{ text: string, numPages: number, info: object }>}
 */
export const extractTextFromPDF = async (filePath) => {
  // Step 1: Read file from disk
  let dataBuffer;
  try {
    dataBuffer = await fs.readFile(filePath);
  } catch (readError) {
    console.error(`[pdfParser] Cannot read file at path: ${filePath}`, readError.message);
    throw new Error(`Cannot read PDF file: ${readError.message}`);
  }

  // Step 2: Validate PDF magic bytes (%PDF header)
  const header = dataBuffer.slice(0, 5).toString("ascii");
  if (!header.startsWith("%PDF")) {
    throw new Error(
      `File does not appear to be a valid PDF. Header bytes: "${header}"`
    );
  }

  // Step 3: Parse PDF text
  try {
    const data = await pdfParse(dataBuffer);

    const text = data.text || "";
    const numPages = data.numpages || 0;
    const info = data.info || {};

    console.log(
      `[pdfParser] ✅ Parsed PDF successfully. Pages: ${numPages}, Text length: ${text.length} chars`
    );

    return { text, numPages, info };
  } catch (parseError) {
    console.error(`[pdfParser] ❌ pdf-parse error:`, parseError.message);
    throw new Error(`Failed to parse PDF content: ${parseError.message}`);
  }
};
