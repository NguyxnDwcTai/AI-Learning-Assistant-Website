/**
 * Split text into chunks for better AI processing.
 * @param {string} text - The input text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of characters to overlap between chunks.
 * @return {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .replace(/\n /g, " ")
    .replace(/ \n/g, "\n")
    .trim();

  const paragraphs = cleanedText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = []; // ✅ Fix Bug 2: array thay vì string
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    if (paragraphWordCount > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);
        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        if (i + chunkSize >= paragraphWords.length) break;
      }
      continue;
    }

    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      const prevChunkText = currentChunk.join(" ");
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords // ✅ Fix Bug 3: đổi tên nhất quán
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex++,
      pageNumber: 0,
    });
  }

  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);
      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= allWords.length) break;
    }
  }

  return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - The array of text chunks.
 * @param {string} query - The search query to match against the chunks.
 * @param {number} maxChunks - The number of top relevant chunks to return.
 * @return {Array<Object>} - An array of relevant chunks sorted by relevance.
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  const stopWords = new Set([
    "the",
    "is",
    "in",
    "and",
    "to",
    "of",
    "a",
    "that",
    "it",
    "with",
    "as",
    "for",
    "was",
    "on",
    "are",
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const chunkText = chunk.content.toLowerCase(); // ✅ Fix Bug 4
    const contentWords = chunkText.split(/\s+/).length;
    let score = 0;

    for (const word of queryWords) {
      const exactMatches = (
        chunkText.match(new RegExp(`\\b${word}\\b`, "g")) || []
      ).length;
      score += exactMatches * 3;

      const partialMatches = (chunkText.match(new RegExp(word, "g")) || [])
        .length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    const uniqueWordsFound = queryWords.filter((word) =>
      chunkText.includes(word),
    ).length;

    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    const normalizedScore = score / Math.sqrt(contentWords);
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      _id: chunk._id,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords: uniqueWordsFound,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedWords !== a.matchedWords)
        return b.matchedWords - a.matchedWords;
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
