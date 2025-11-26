import { v4 as uuidv4 } from 'uuid';

export function transformQuestions(jsonData) {
  const newId = uuidv4();

 
const questions = jsonData.data.map((q) => {
    // 1. Get the options as an array of strings
    const optionsArray = Object.values(q.options);
    const optionsKeys = Object.keys(q.options);

    let correctIndex = -1;

    correctIndex = optionsArray.indexOf(q.correctAnswer);
    if (correctIndex === -1) {
        correctIndex = optionsKeys.findIndex(
            (key) => key.toLowerCase() === String(q.correctAnswer).toLowerCase()
        );
    }
    if (correctIndex === -1) console.warn(`Answer not found for: ${q.questionText}`);

    return {
      id: uuidv4(), 
      prompt: q.questionText,
      choices: optionsArray,
      answer: correctIndex,
      explanation: q.solution || "No explanation provided."
    };
});

return {
    id: newId,
    questions
};

}
