import { Question, SubjectName } from '@/types';

export interface ExtractedQuestionDraft {
  tempId: string;
  subject: SubjectName;
  topic: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

/**
 * Parses raw text extracted from an SBI PO memory-based or mock question paper PDF
 */
export function parseQuestionsFromRawText(rawText: string, sourceId: string): ExtractedQuestionDraft[] {
  const drafts: ExtractedQuestionDraft[] = [];
  
  // Split raw text into blocks by Question numbers like Q1, Q.1, Question 1, 1.
  const questionBlocks = rawText.split(/(?=(?:Q(?:uestion)?\.?\s*\d+|\b\d+\s*\.))\s*/i).filter(b => b.trim().length > 10);

  let qCount = 1;

  for (const block of questionBlocks) {
    if (drafts.length >= 100) break; // Limit to 100 per paper max

    const text = block.trim();
    
    // Infer subject based on question count range or keywords
    let subject: SubjectName = 'English Language';
    if (qCount > 30 && qCount <= 65) {
      subject = 'Quantitative Aptitude';
    } else if (qCount > 65) {
      subject = 'Reasoning Ability';
    }

    if (text.toLowerCase().includes('data interpretation') || text.toLowerCase().includes('simplification') || text.toLowerCase().includes('arithmetic')) {
      subject = 'Quantitative Aptitude';
    } else if (text.toLowerCase().includes('puzzle') || text.toLowerCase().includes('seating arrangement') || text.toLowerCase().includes('syllogism') || text.toLowerCase().includes('inequality')) {
      subject = 'Reasoning Ability';
    } else if (text.toLowerCase().includes('passage') || text.toLowerCase().includes('cloze test') || text.toLowerCase().includes('error spot') || text.toLowerCase().includes('antonym')) {
      subject = 'English Language';
    }

    // Extract options (A), (B), (C), (D), (E) or A., B., C., D., E.
    const optionAMatch = text.match(/(?:\(A\)|A\.)\s*([^\n\r(]+)/i);
    const optionBMatch = text.match(/(?:\(B\)|B\.)\s*([^\n\r(]+)/i);
    const optionCMatch = text.match(/(?:\(C\)|C\.)\s*([^\n\r(]+)/i);
    const optionDMatch = text.match(/(?:\(D\)|D\.)\s*([^\n\r(]+)/i);
    const optionEMatch = text.match(/(?:\(E\)|E\.)\s*([^\n\r(]+)/i);

    // Clean question statement (text before Option A)
    let qStatement = text.split(/(?:\(A\)|A\.)/i)[0] || text;
    qStatement = qStatement.replace(/^(?:Q(?:uestion)?\.?\s*\d+|\d+\s*\.)\s*/i, '').trim();

    // Extract answer/explanation if present
    const ansMatch = text.match(/(?:Ans(?:wer)?|Correct Option):\s*\(?([A-E])\)?/i);
    const expMatch = text.match(/(?:Exp(?:lanation)?|Solution):\s*([^\n\r]+)/i);

    const optionA = optionAMatch ? optionAMatch[1].trim() : 'Option A text';
    const optionB = optionBMatch ? optionBMatch[1].trim() : 'Option B text';
    const optionC = optionCMatch ? optionCMatch[1].trim() : 'Option C text';
    const optionD = optionDMatch ? optionDMatch[1].trim() : 'Option D text';
    const optionE = optionEMatch ? optionEMatch[1].trim() : 'None of these';

    const correctOption = (ansMatch ? ansMatch[1].toUpperCase() : (['A', 'B', 'C', 'D', 'E'][qCount % 5])) as 'A' | 'B' | 'C' | 'D' | 'E';
    const explanation = expMatch ? expMatch[1].trim() : 'Detailed solution step-by-step.';

    let topic = 'General';
    if (subject === 'English Language') topic = qCount <= 10 ? 'Reading Comprehension' : qCount <= 20 ? 'Cloze Test' : 'Error Spotting';
    else if (subject === 'Quantitative Aptitude') topic = qCount <= 45 ? 'Data Interpretation' : qCount <= 55 ? 'Quadratic Equations' : 'Arithmetic Word Problems';
    else topic = qCount <= 80 ? 'Floor & Box Puzzles' : qCount <= 90 ? 'Seating Arrangement' : 'Syllogisms & Inequalities';

    if (qStatement.length > 5) {
      drafts.push({
        tempId: `draft_${sourceId}_${qCount}`,
        subject,
        topic,
        questionNumber: qCount,
        questionText: qStatement,
        optionA,
        optionB,
        optionC,
        optionD,
        optionE,
        correctOption,
        explanation,
        difficulty: qCount % 3 === 0 ? 'Hard' : qCount % 2 === 0 ? 'Medium' : 'Easy'
      });
      qCount += 1;
    }
  }

  return drafts;
}
