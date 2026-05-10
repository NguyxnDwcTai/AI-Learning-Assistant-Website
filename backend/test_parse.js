const generatedText = `
Q: What is the capital of France?
O1: London
O2: Berlin
O3: Paris
O4: Madrid
C: Paris
E: Paris is the capital of France.
D: easy
---
Q: What is 2+2?
O1: 3
O2: 4
O3: 5
O4: 6
C: 4
E: 2+2 is 4.
D: easy
`;
const questions = [];
const questionBlocks = generatedText.split('---').filter(q => q.trim());
for (const block of questionBlocks) {
    const lines = block.split('\n');
    let questionText = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('Q: ')) {
            questionText = trimmed.substring(3).trim();           
        } else if (trimmed.match(/^O\d:/)) {                     
            options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C: ')) {
            correctAnswer = trimmed.substring(3).trim();
        } else if (trimmed.startsWith('E: ')) {
            explanation = trimmed.substring(3).trim();
        } else if (trimmed.startsWith('D: ')) {
            const diff = trimmed.substring(3).trim().toLowerCase();
            if (['easy', 'medium', 'hard'].includes(diff)) {
                difficulty = diff;
            }
        }
    }

    if (questionText && options.length === 4 && correctAnswer) {
        questions.push({ questionText, options, correctAnswer, explanation, difficulty }); 
    } else {
        console.log('Failed:', {questionText, optionsCount: options.length, correctAnswer});
    }
}
console.log(JSON.stringify(questions, null, 2));
