import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateFlashcards = async (documentId, count = 10) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
            documentId,
            count
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate flashcards.' };
    }
};
const generateQuiz = async (documentId, numQuestions = 5) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
            documentId,
            numQuestions
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate quiz.' };
    }
};

const generateSummary = async (documentId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
            documentId
        });
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate summary.' };
    }
};

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
            documentId,
            question: message
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Chat request failed.' };
    }
};

const explainConcept = async(documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
            documentId,
            concept
        });
        return response.data?.data;
    } catch (error) {
        throw error.response?.data || { message: 'Explanation request failed.' };
    }
};

const getChatHistory = async(documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get chat history.' };
    }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
};

export default aiService;