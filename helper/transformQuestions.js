import { v4 as uuidv4 } from 'uuid';

export function transformQuestions(jsonData) {
  // Generate a unique id for the overall question set
  const newId = uuidv4();

  const questions = jsonData.data.map((q) => {
    const optionsArray = Object.values(q.option);
    const correctIndex = Object.keys(q.option).indexOf(q.answer);

    return {
      id: uuidv4(),
      prompt: q.question,
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
