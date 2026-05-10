import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

if (!process.env.GEMINI_API_KEY) {
    console.error('FATAL ERROR: GEMINI_API_KEY is not set in the enviroment variables');
    process.exit(1);
}

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} educational flashcards from the following text.
    Respond ONLY with a valid JSON array of objects. Do not include any markdown formatting or extra text.
    Each object must have exactly these keys:
    "question" (string): The flashcard question.
    "answer" (string): The concise answer.
    "difficulty" (string): Must be exactly "easy", "medium", or "hard".
    
    Text:
    ${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        let generatedText = response.text;
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        //Parse the response
        let parsedCards = [];
        try {
            const parsed = JSON.parse(generatedText);
            // Handle if LLM wraps array in an object
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                parsedCards = parsed.flashcards || parsed.cards || parsed.data || parsed.questions || [];
            } else if (Array.isArray(parsed)) {
                parsedCards = parsed;
            }
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", generatedText);
            throw new Error("Invalid JSON returned from Gemini");
        }

        const flashcards = parsedCards.map(card => {
            const question = card.question || card.q || card.Question || card.front || '';
            const answer = card.answer || card.a || card.Answer || card.back || '';
            const difficultyStr = (card.difficulty || card.d || card.Difficulty || 'medium').toLowerCase();
            return {
                question: question,
                answer: answer,
                difficulty: ['easy', 'medium', 'hard'].includes(difficultyStr) ? difficultyStr : 'medium'
            };
        }).filter(card => card.question && card.answer);

        return flashcards.slice(0, count);
    } catch (error) {
        console.error('Gemini API error: ', error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const err = new Error('AI rate limit exceeded. Please wait a minute and try again.');
            err.statusCode = 429;
            throw err;
        }
        throw new Error('Failed to generate flashcards');
    }
};

/**
 * Generate quiz question
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @param {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
    Respond ONLY with a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json or extra text.
    Each object must have exactly these keys:
    "questionText" (string): The question text.
    "options" (array of exactly 4 strings): The 4 multiple choice options.
    "correctAnswer" (string): The exact string of the correct option.
    "explanation" (string): A brief explanation of the answer.
    "difficulty" (string): Must be exactly "easy", "medium", or "hard".
    
    Text:
    ${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        let generatedText = response.text;
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsedQuestions = [];
        try {
            const parsed = JSON.parse(generatedText);
            // Handle if LLM wraps array in an object
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                // Find the first property that is an array
                const arrayKey = Object.keys(parsed).find(key => Array.isArray(parsed[key]));
                parsedQuestions = arrayKey ? parsed[arrayKey] : [];
            } else if (Array.isArray(parsed)) {
                parsedQuestions = parsed;
            }
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", generatedText);
            throw new Error("Invalid JSON returned from Gemini");
        }
        
        if (!parsedQuestions || parsedQuestions.length === 0) {
            console.error("Parsed questions is empty. Raw Gemini output was:", generatedText);
            throw new Error("AI did not return any valid questions. Please try again.");
        }

        const questions = parsedQuestions.map(q => {
            let options = Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : []);
            
            // If options were not parsed as array but instead as individual keys O1, O2, O3, O4
            if (options.length === 0) {
                const o1 = q.o1 || q.O1 || q.option1 || q.Option1;
                const o2 = q.o2 || q.O2 || q.option2 || q.Option2;
                const o3 = q.o3 || q.O3 || q.option3 || q.Option3;
                const o4 = q.o4 || q.O4 || q.option4 || q.Option4;
                if (o1 && o2) {
                    options = [o1, o2];
                    if (o3) options.push(o3);
                    if (o4) options.push(o4);
                }
            }

            while (options.length < 4) options.push("None of the above");
            if (options.length > 4) options = options.slice(0, 4);

            const questionText = q.questionText || q.question || q.Question || q.text || q.q || '';
            let correctAnswer = q.correctAnswer || q.correct_answer || q.answer || q.Answer || q.correctOption || q.c || '';
            const explanation = q.explanation || q.Explanation || q.reason || q.e || '';
            const difficultyStr = (q.difficulty || q.Difficulty || q.d || 'medium').toLowerCase();

            // Sometime LLM returns just the letter or index (e.g., "A", "1") instead of the exact string.
            // We should just store what it returns. If it's a number, convert to string.
            if (typeof correctAnswer === 'number') {
                correctAnswer = options[correctAnswer] || correctAnswer.toString();
            }

            return {
                questionText: questionText,
                options: options,
                correctAnswer: correctAnswer.toString(),
                explanation: explanation,
                difficulty: ['easy', 'medium', 'hard'].includes(difficultyStr) ? difficultyStr : 'medium'
            };
        }).filter(q => q.questionText && q.correctAnswer);

        console.log("Parsed questions count:", questions.length);

        return questions.slice(0, numQuestions);                          
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const err = new Error('AI rate limit exceeded. Please wait a minute and try again.');
            err.statusCode = 429;
            throw err;
        }
        throw new Error('Failed to generate quiz');
    }
};

/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
    const prompt = `Provide a concise summary of the following text, highlighting the key concepts, main ideas, and important points.
    Keep the summary clear and structed.
    
    Text:
    ${text.substring(0, 20000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        const generatedText = response.text;
        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const err = new Error('AI rate limit exceeded. Please wait a minute and try again.');
            err.statusCode = 429;
            throw err;
        }
        throw new Error('Failed to generate summary');
    }
};

/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Chunk ${i + 1}]\n${c.content}`).join('\n\n');

    const prompt = `Based on the following context from a document, Analyse the context and answer the user's question accurately.
    If the answer is not in the context, say no.
    
    Context:
    ${context}
    
    Question:
    ${question}
    
    Answer:`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;
        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const err = new Error('AI rate limit exceeded. Please wait a minute and try again.');
            err.statusCode = 429;
            throw err;
        }
        throw new Error('Failed to process chat request');
    }
};

/**
 * Explain a specific concept
 * @param {string} concept - Concept to expain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
    const prompt = `Explain the concept of ${concept} based on the following context.
    Provide a clear, educational explanation that's easy to understand.
    Inculde examples if relevant.
    
    Context:
    ${context.substring(0, 10000)}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;
        return generatedText;
    } catch (error) {
        console.error('Gemini API error: ', error);
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            const err = new Error('AI rate limit exceeded. Please wait a minute and try again.');
            err.statusCode = 429;
            throw err;
        }
        throw new Error('Failed to explain concept');
    }
};