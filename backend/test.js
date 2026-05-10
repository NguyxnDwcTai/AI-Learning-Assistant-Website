
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Document = (await import('./models/Document.js')).default;
  const document = await Document.findOne({ title: /PEBasic/i });
  if (!document) { console.log('not found'); process.exit(0); }
  console.log('Doc ID:', document._id);
  
  const geminiService = await import('./utils/geminiService.js');
  
  try {
    const questions = await geminiService.generateQuiz(document.extractedText, 5);
    console.log('Parsed questions count:', questions.length);
    console.log(JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

test();

