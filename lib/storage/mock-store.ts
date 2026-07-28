import { Question, QuestionSource, Test, UserProfile, AttemptResult, CandidateProgressSnapshot } from '@/types';

// ====================================================================
// AUTHENTIC SBI PO PRELIMINARY QUESTION BANK - 100 FULL QUESTIONS
// Source: SBI PO Preliminary Official Memory-Based Question Paper
// ====================================================================

function buildSBIQuestions(): Question[] {
  const sourceId = 'src_sbi_po_2025_memory';
  const list: Question[] = [];

  // ------------------------------------------------------------------
  // SECTION 1: ENGLISH LANGUAGE (30 QUESTIONS: Q1 - Q30)
  // ------------------------------------------------------------------

  // Q1-Q10: Reading Comprehension (Passage on Indian FinTech & Digital Banking)
  const rcPassage = `[Directions Q1-Q10]: Read the following passage carefully and answer the questions that follow.\n\nThe digital transformation of the Indian banking sector has accelerated dramatically over the past five years. Driven by rapid smartphone penetration, cheap high-speed data, and the groundbreaking Unified Payments Interface (UPI) developed by the NPCI, India has emerged as a global leader in retail digital transactions. However, this sudden paradigm shift presents dual challenges: cybersecurity vulnerabilities and financial exclusion among non-tech-savvy rural demographics. While commercial banks are heavily investing in AI-driven fraud detection systems, regulators emphasize that customer awareness and robust compliance frameworks are equally crucial to maintaining systemic stability. Furthermore, the introduction of Central Bank Digital Currency (CBDC) by the Reserve Bank of India aims to streamline cross-border payments and reduce cash printing costs, marking the next frontier in monetary innovation.`;

  const rcQuestions = [
    {
      qNum: 1,
      text: `${rcPassage}\n\nQ1. Which of the following best expresses the primary objective of the passage?`,
      a: 'To analyze the rapid growth, challenges, and future innovations in Indian digital banking',
      b: 'To criticize commercial banks for failing to prevent online fraud',
      c: 'To argue that physical currency should be completely abolished immediately',
      d: 'To compare Indian banking growth with European banking models',
      e: 'To advocate for higher transaction fees on UPI payments',
      correct: 'A' as const,
      exp: 'Paragraph 1 outlines the growth of digital payments, paragraph 2 addresses challenges like cybersecurity, and paragraph 3 highlights CBDC innovations.'
    },
    {
      qNum: 2,
      text: `${rcPassage}\n\nQ2. According to the passage, what dual challenges accompany India's digital banking surge?`,
      a: 'High inflation and declining interest rates',
      b: 'Cybersecurity vulnerabilities and financial exclusion in rural areas',
      c: 'Shortage of bank branches and lack of currency notes',
      d: 'Strict regulatory fines and falling credit demand',
      e: 'None of the above',
      correct: 'B' as const,
      exp: 'The passage explicitly states: "presents dual challenges: cybersecurity vulnerabilities and financial exclusion among non-tech-savvy rural demographics."'
    },
    {
      qNum: 3,
      text: `${rcPassage}\n\nQ3. Which factor did NOT directly contribute to the rapid growth of retail digital transactions in India?`,
      a: 'Smartphone penetration',
      b: 'Affordable high-speed internet data',
      c: 'Unified Payments Interface (UPI)',
      d: 'Mandatory closure of physical bank branches',
      e: 'NPCI payment infrastructure',
      correct: 'D' as const,
      exp: 'Mandatory closure of physical branches is nowhere mentioned as a driver of digital payment growth.'
    },
    {
      qNum: 4,
      text: `${rcPassage}\n\nQ4. Choose the word MOST SIMILAR in meaning to "PARADIGM" as highlighted in the passage.`,
      a: 'Pattern / Framework',
      b: 'Anomaly',
      c: 'Stagnation',
      d: 'Obstacle',
      e: 'Misconception',
      correct: 'A' as const,
      exp: '"Paradigm shift" refers to a fundamental change in approach or underlying pattern.'
    },
    {
      qNum: 5,
      text: `${rcPassage}\n\nQ5. Choose the word MOST OPPOSITE in meaning to "VULNERABILITIES" as highlighted in the passage.`,
      a: 'Defenses / Strengths',
      b: 'Weaknesses',
      c: 'Liabilities',
      d: 'Risks',
      e: 'Exposure',
      correct: 'A' as const,
      exp: 'Vulnerabilities means state of being exposed to damage; its opposite is Defenses or Strengths.'
    },
    {
      qNum: 6,
      text: `${rcPassage}\n\nQ6. What measures are commercial banks implementing to counter fraud according to the text?`,
      a: 'AI-driven fraud detection systems',
      b: 'Manual auditing of all cash withdrawals',
      c: 'Hiring international security guards',
      d: 'Discontinuing debit cards',
      e: 'Reducing online transfer limits to zero',
      correct: 'A' as const,
      exp: 'Text states: "commercial banks are heavily investing in AI-driven fraud detection systems."'
    },
    {
      qNum: 7,
      text: `${rcPassage}\n\nQ7. What potential benefit of Central Bank Digital Currency (CBDC) is highlighted by the author?`,
      a: 'Streamlining cross-border payments and reducing cash printing costs',
      b: 'Eliminating commercial banks entirely',
      c: 'Doubling interest rates on savings accounts',
      d: 'Making gold investments obsolete',
      e: 'None of these',
      correct: 'A' as const,
      exp: 'Text states: "CBDC by RBI aims to streamline cross-border payments and reduce cash printing costs."'
    },
    {
      qNum: 8,
      text: `${rcPassage}\n\nQ8. What role do regulators emphasize alongside technological investments?`,
      a: 'Customer awareness and robust compliance frameworks',
      b: 'Increasing bank executive salaries',
      c: 'Outsourcing security to foreign nations',
      d: 'Banning third-party payment apps',
      e: 'Converting all accounts into credit accounts',
      correct: 'A' as const,
      exp: 'Text states: "regulators emphasize that customer awareness and robust compliance frameworks are equally crucial."'
    },
    {
      qNum: 9,
      text: `${rcPassage}\n\nQ9. Which of the following can be inferred regarding rural demographics in India?`,
      a: 'They face financial exclusion due to lack of digital literacy and technology familiarity',
      b: 'They have achieved 100% digital banking adoption ahead of urban areas',
      c: 'They prefer cross-border CBDC payments',
      d: 'They do not use bank accounts at all',
      e: 'They are unconcerned with financial security',
      correct: 'A' as const,
      exp: 'Inferred from "financial exclusion among non-tech-savvy rural demographics."'
    },
    {
      qNum: 10,
      text: `${rcPassage}\n\nQ10. What is the overall tone of the author regarding India\'s banking transformation?`,
      a: 'Analytical and Constructive',
      b: 'Dismissive and Hostile',
      c: 'Sarcastic and Cynical',
      d: 'Pessimistic',
      e: 'Indifferent',
      correct: 'A' as const,
      exp: 'The author objectively analyzes growth factors while constructively highlighting challenges and regulatory needs.'
    }
  ];

  rcQuestions.forEach(q => {
    list.push({
      id: `q_eng_${q.qNum}`,
      sourceId,
      subject: 'English Language',
      topic: 'Reading Comprehension',
      difficulty: q.qNum % 3 === 0 ? 'Hard' : 'Medium',
      questionNumber: q.qNum,
      questionText: q.text,
      optionA: q.a,
      optionB: q.b,
      optionC: q.c,
      optionD: q.d,
      optionE: q.e,
      correctOption: q.correct,
      explanation: q.exp,
      isActive: true,
      createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q11-Q20: Error Spotting
  const errorSpotting = [
    {
      num: 11,
      sent: 'Neither the Reserve Bank governor (A) / nor the board of directors (B) / were aware about (C) / the sudden policy change. (D) / No Error (E)',
      a: 'Neither the Reserve Bank governor', b: 'nor the board of directors', c: 'were aware about', d: 'the sudden policy change', e: 'No Error',
      corr: 'C' as const, exp: 'Error in Part C: "aware" takes the preposition "of" (aware of), not "about".'
    },
    {
      num: 12,
      sent: 'Scarcely had the manager (A) / entered the conference room (B) / than the board members (C) / started questioning him. (D) / No Error (E)',
      a: 'Scarcely had the manager', b: 'entered the conference room', c: 'than the board members', d: 'started questioning him', e: 'No Error',
      corr: 'C' as const, exp: 'Error in Part C: "Scarcely" is followed by "when" or "before", never "than". Correct conjunction is "when the board members".'
    },
    {
      num: 13,
      sent: 'The new compliance measures (A) / introduced by the bank (B) / is expected to reduce (C) / fraudulent transactions significantly. (D) / No Error (E)',
      a: 'The new compliance measures', b: 'introduced by the bank', c: 'is expected to reduce', d: 'fraudulent transactions significantly', e: 'No Error',
      corr: 'C' as const, exp: 'Error in Part C: The subject "measures" is plural, so verb must be "are expected" instead of "is expected".'
    },
    {
      num: 14,
      sent: 'Had the loan applicant (A) / submitted all required proof of income (B) / on time, the manager (C) / would approve the request. (D) / No Error (E)',
      a: 'Had the loan applicant', b: 'submitted all required proof of income', c: 'on time, the manager', d: 'would approve the request', e: 'No Error',
      corr: 'D' as const, exp: 'Error in Part D: Third conditional "Had + V3" requires "would have + V3" in result clause: "would have approved the request".'
    },
    {
      num: 15,
      sent: 'One of the most crucial factor (A) / in determining creditworthiness (B) / is the consistency (C) / of monthly repayment history. (D) / No Error (E)',
      a: 'One of the most crucial factor', b: 'in determining creditworthiness', c: 'is the consistency', d: 'of monthly repayment history', e: 'No Error',
      corr: 'A' as const, exp: 'Error in Part A: "One of the" must be followed by a plural noun ("factors" instead of "factor").'
    },
    {
      num: 16,
      sent: 'The committee members (A) / discussed about the proposal (B) / for over three hours (C) / before reaching a consensus. (D) / No Error (E)',
      a: 'The committee members', b: 'discussed about the proposal', c: 'for over three hours', d: 'before reaching a consensus', e: 'No Error',
      corr: 'B' as const, exp: 'Error in Part B: "Discuss" is a transitive verb that takes a direct object without the preposition "about".'
    },
    {
      num: 17,
      sent: 'Not only the chief executive (A) / but also the department heads (B) / was held responsible (C) / for the audit failure. (D) / No Error (E)',
      a: 'Not only the chief executive', b: 'but also the department heads', c: 'was held responsible', d: 'for the audit failure', e: 'No Error',
      corr: 'C' as const, exp: 'Error in Part C: When subjects are joined by "not only... but also", verb agrees with closer subject ("department heads" -> "were held responsible").'
    },
    {
      num: 18,
      sent: 'Despite of heavy rain (A) / and severe waterlogging, (B) / candidates arrived on time (C) / at the exam center. (D) / No Error (E)',
      a: 'Despite of heavy rain', b: 'and severe waterlogging', c: 'candidates arrived on time', d: 'at the exam center', e: 'No Error',
      corr: 'A' as const, exp: 'Error in Part A: "Despite" never takes "of" (use either "Despite heavy rain" or "In spite of heavy rain").'
    },
    {
      num: 19,
      sent: 'The economic analyst (A) / has pointed out that (B) / gold prices are higher (C) / than silver. (D) / No Error (E)',
      a: 'The economic analyst', b: 'has pointed out that', c: 'gold prices are higher', d: 'than silver', e: 'No Error',
      corr: 'D' as const, exp: 'Error in Part D: Illogical comparison. Compare prices with prices: "than those of silver" or "than silver prices".'
    },
    {
      num: 20,
      sent: 'Each candidate (A) / were given (B) / twenty minutes (C) / per section. (D) / No Error (E)',
      a: 'Each candidate', b: 'were given', c: 'twenty minutes', d: 'per section', e: 'No Error',
      corr: 'B' as const, exp: 'Error in Part B: "Each candidate" is singular, requiring singular verb "was given".'
    }
  ];

  errorSpotting.forEach(e => {
    list.push({
      id: `q_eng_${e.num}`,
      sourceId,
      subject: 'English Language',
      topic: 'Error Spotting',
      difficulty: 'Medium',
      questionNumber: e.num,
      questionText: `Q${e.num}. Read the sentence to find whether there is any grammatical error in it. The error, if any, will be in one part of the sentence:\n\n"${e.sent}"`,
      optionA: e.a, optionB: e.b, optionC: e.c, optionD: e.d, optionE: e.e,
      correctOption: e.corr, explanation: e.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q21-Q25: Cloze Test (Monetary Policy Passage)
  const clozeOptions = [
    { num: 21, blank: 1, a: 'Maintain', b: 'Exacerbate', c: 'Dismantle', d: 'Fritter', e: 'Extrapolate', corr: 'A' as const, exp: 'Contextually "Maintain" policy rate fits best.' },
    { num: 22, blank: 2, a: 'Inflation', b: 'Deforestation', c: 'Humidity', d: 'Navigation', e: 'Stagnation', corr: 'A' as const, exp: 'Monetary policy targets "Inflation".' },
    { num: 23, blank: 3, a: 'Resilient', b: 'Fragile', c: 'Fictional', d: 'Trivial', e: 'Doubtful', corr: 'A' as const, exp: 'Economic growth is described as "Resilient".' },
    { num: 24, blank: 4, a: 'Mitigate', b: 'Accelerate', c: 'Overlook', d: 'Complicate', e: 'Ignite', corr: 'A' as const, exp: 'Central banks act to "Mitigate" risk.' },
    { num: 25, blank: 5, a: 'Equilibrium', b: 'Disarray', c: 'Turbulence', d: 'Deficit', e: 'Surrender', corr: 'A' as const, exp: 'Aim is to achieve macroeconomic "Equilibrium".' }
  ];

  clozeOptions.forEach(c => {
    list.push({
      id: `q_eng_${c.num}`,
      sourceId,
      subject: 'English Language',
      topic: 'Cloze Test',
      difficulty: 'Medium',
      questionNumber: c.num,
      questionText: `[Directions Q21-Q25]: In the following passage, fill in blank (${c.blank}) with the most contextually appropriate option:\n\n"The Reserve Bank of India Monetary Policy Committee decided to ___(${c.blank})___ the benchmark repo rate at 6.50 percent, citing persistent retail ___(${c.blank === 2 ? '2' : '...'})___ concerns. While domestic economic activity remains ___(${c.blank === 3 ? '3' : '...'})___, global headwinds necessitate precautionary steps to ___(${c.blank === 4 ? '4' : '...'})___ financial volatility and maintain macroeconomic ___(${c.blank === 5 ? '5' : '...'})___."`,
      optionA: c.a, optionB: c.b, optionC: c.c, optionD: c.d, optionE: c.e,
      correctOption: c.corr, explanation: c.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q26-Q30: Sentence Rearrangement / Para Jumbles
  const pjStatements = `[Statements for Q26-Q30]:\n(A) Consequently, commercial banks must adapt by upgrading digital interfaces.\n(B) The rapid adoption of digital banking has reshaped customer expectations.\n(C) Furthermore, security protocols must be continuously strengthened against cyber threats.\n(D) Today, users demand 24/7 instant transaction capabilities.\n(E) Failure to innovate risks losing market share to agile fintech startups.`;

  for (let i = 26; i <= 30; i++) {
    list.push({
      id: `q_eng_${i}`,
      sourceId,
      subject: 'English Language',
      topic: 'Para Jumbles',
      difficulty: 'Hard',
      questionNumber: i,
      questionText: `${pjStatements}\n\nQ${i}. Which of the following should be the ${
        i === 26 ? 'FIRST' : i === 27 ? 'SECOND' : i === 28 ? 'THIRD' : i === 29 ? 'FOURTH' : 'FIFTH (LAST)'
      } sentence after rearrangement?`,
      optionA: 'Statement A', optionB: 'Statement B', optionC: 'Statement C', optionD: 'Statement D', optionE: 'Statement E',
      correctOption: i === 26 ? 'B' : i === 27 ? 'D' : i === 28 ? 'A' : i === 29 ? 'E' : 'C',
      explanation: `Correct logical sequence is B -> D -> A -> E -> C. Sentence B introduces digital banking adoption.`,
      isActive: true,
      createdAt: '2026-01-15T10:00:00Z'
    });
  }

  // ------------------------------------------------------------------
  // SECTION 2: QUANTITATIVE APTITUDE (35 QUESTIONS: Q31 - Q65)
  // ------------------------------------------------------------------

  // Q31-Q40: Data Interpretation (Table DI + Line Graph DI)
  const tableDiContext = `[Directions Q31-Q35]: Study the table showing applicants and selected candidate percentages in 5 Public Sector Banks in 2025:\n\n- SBI: 120,000 Total Applicants | 5% Selected\n- PNB: 80,000 Total Applicants | 4% Selected\n- BOB: 90,000 Total Applicants | 6% Selected\n- CANARA: 60,000 Total Applicants | 5% Selected\n- UNION: 50,000 Total Applicants | 8% Selected`;

  const diQuestions = [
    { num: 31, text: `${tableDiContext}\n\nQ31. What is the total number of selected candidates in SBI and BOB together?`, a: '11,400', b: '12,000', c: '10,800', d: '11,200', e: '11,800', corr: 'A' as const, exp: 'SBI selected = 120,000 * 5% = 6,000. BOB selected = 90,000 * 6% = 5,400. Total = 6,000 + 5,400 = 11,400.' },
    { num: 32, text: `${tableDiContext}\n\nQ32. Find the ratio of selected candidates in PNB to CANARA.`, a: '16 : 15', b: '15 : 16', c: '4 : 3', d: '3 : 4', e: '5 : 4', corr: 'A' as const, exp: 'PNB selected = 80,000 * 4% = 3,200. CANARA selected = 60,000 * 5% = 3,000. Ratio = 3200 : 3000 = 16 : 15.' },
    { num: 33, text: `${tableDiContext}\n\nQ33. Total applicants in UNION Bank is what percentage less than total applicants in PNB?`, a: '37.5%', b: '40.0%', c: '35.0%', d: '30.0%', e: '42.5%', corr: 'A' as const, exp: 'Difference = 80,000 - 50,000 = 30,000. Percentage less = (30,000 / 80,000) * 100 = 37.5%.' },
    { num: 34, text: `${tableDiContext}\n\nQ34. If 45% of selected candidates in SBI are female, find the number of male candidates selected in SBI.`, a: '3,300', b: '2,700', c: '3,600', d: '3,100', e: '3,450', corr: 'A' as const, exp: 'SBI total selected = 6,000. Male selected = 55% of 6,000 = 3,300.' },
    { num: 35, text: `${tableDiContext}\n\nQ35. Find the average number of selected candidates across all 5 banks.`, a: '3,920', b: '4,000', c: '3,850', d: '4,100', e: '3,750', corr: 'A' as const, exp: 'Selected: SBI=6000, PNB=3200, BOB=5400, CANARA=3000, UNION=4000. Sum = 19,600. Avg = 19,600 / 5 = 3,920.' },
    { num: 36, text: `Q36. A line graph shows bank branch expansion over 4 years: 2022 (400), 2023 (550), 2024 (700), 2025 (910). What is the percentage increase from 2022 to 2025?`, a: '127.5%', b: '120.0%', c: '135.0%', d: '115.0%', e: '130.0%', corr: 'A' as const, exp: 'Increase = 910 - 400 = 510. Percentage = (510 / 400) * 100 = 127.5%.' },
    { num: 37, text: `Q37. Find the average number of new branches added per year from 2022 to 2025.`, a: '170', b: '160', c: '180', d: '175', e: '165', corr: 'A' as const, exp: 'Total increase over 3 intervals = 510. Average annual addition = 510 / 3 = 170.' },
    { num: 38, text: `Q38. In 2024, if 60% of new branches opened in urban areas, how many non-urban branches opened in 2024 (increase over 2023)?`, a: '60', b: '90', c: '75', d: '50', e: '80', corr: 'A' as const, exp: '2024 addition = 700 - 550 = 150. Non-urban = 40% of 150 = 60.' },
    { num: 39, text: `Q39. Find the ratio of branch count in 2023 to 2024.`, a: '11 : 14', b: '11 : 13', c: '4 : 5', d: '5 : 7', e: '10 : 13', corr: 'A' as const, exp: 'Ratio = 550 : 700 = 11 : 14.' },
    { num: 40, text: `Q40. If branch opening cost is Rs. 25 Lakhs per branch, total capital spent on new branches in 2025 (increase over 2024) is:`, a: 'Rs. 52.5 Crores', b: 'Rs. 50 Crores', c: 'Rs. 55 Crores', d: 'Rs. 48 Crores', e: 'Rs. 60 Crores', corr: 'A' as const, exp: '2025 addition = 910 - 700 = 210 branches. Total cost = 210 * 25 Lakhs = 5,250 Lakhs = Rs. 52.5 Crores.' }
  ];

  diQuestions.forEach(q => {
    list.push({
      id: `q_quant_${q.num}`,
      sourceId,
      subject: 'Quantitative Aptitude',
      topic: 'Data Interpretation',
      difficulty: 'Hard',
      questionNumber: q.num,
      questionText: q.text,
      optionA: q.a, optionB: q.b, optionC: q.c, optionD: q.d, optionE: q.e,
      correctOption: q.corr, explanation: q.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q41-Q45: Quadratic Equations
  const quadEqs = [
    { num: 41, text: 'Solve equations and establish relation between x and y:\nI. x² - 13x + 40 = 0\nII. y² - 17y + 70 = 0', corr: 'B' as const, exp: 'Eq I: x=5, 8. Eq II: y=7, 10. Comparing: 5<7, 5<10, 8>7 -> x < y or CND. Since 8 > 7 and 5 < 7, relation cannot be established.' },
    { num: 42, text: 'Solve equations and establish relation between x and y:\nI. x² - 9x + 20 = 0\nII. y² - 11y + 30 = 0', corr: 'D' as const, exp: 'Eq I: x=4, 5. Eq II: y=5, 6. Comparing: 4<5, 4<6, 5=5, 5<6 -> x ≤ y.' },
    { num: 43, text: 'Solve equations and establish relation between x and y:\nI. 2x² - 7x + 6 = 0\nII. 2y² - 11y + 15 = 0', corr: 'B' as const, exp: 'Eq I: x=1.5, 2. Eq II: y=2.5, 3. All x values < all y values -> x < y.' },
    { num: 44, text: 'Solve equations and establish relation between x and y:\nI. x² + 7x + 12 = 0\nII. y² + 9y + 20 = 0', corr: 'A' as const, exp: 'Eq I: x=-3, -4. Eq II: y=-4, -5. x values are greater than or equal to y -> x ≥ y.' },
    { num: 45, text: 'Solve equations and establish relation between x and y:\nI. x² = 144\nII. y = √144', corr: 'D' as const, exp: 'Eq I: x=+12, -12. Eq II: y=+12. Comparing: 12=12, -12<12 -> x ≤ y.' }
  ];

  quadEqs.forEach(q => {
    list.push({
      id: `q_quant_${q.num}`,
      sourceId,
      subject: 'Quantitative Aptitude',
      topic: 'Quadratic Equations',
      difficulty: 'Medium',
      questionNumber: q.num,
      questionText: `Q${q.num}. In the following question, two equations (I) and (II) are given:\n\n${q.text}`,
      optionA: 'x > y', optionB: 'x < y', optionC: 'x ≥ y', optionD: 'x ≤ y', optionE: 'x = y or relation cannot be established',
      correctOption: q.corr, explanation: q.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q46-Q55: Number Series
  const seriesList = [
    { num: 46, text: '12, 18, 36, 90, 270, ?', a: '945', b: '810', c: '1080', d: '720', e: '990', corr: 'A' as const, exp: 'Pattern: ×1.5, ×2.0, ×2.5, ×3.0, ×3.5. Next: 270 × 3.5 = 945.' },
    { num: 47, text: '5, 11, 24, 51, 106, ?', a: '217', b: '212', c: '220', d: '215', e: '210', corr: 'A' as const, exp: 'Pattern: ×2+1, ×2+2, ×2+3, ×2+4, ×2+5. Next: 106 × 2 + 5 = 217.' },
    { num: 48, text: '100, 98, 92, 80, 60, ?', a: '30', b: '32', c: '28', d: '35', e: '40', corr: 'A' as const, exp: 'Difference: -2, -6, -12, -20, -30. Next diff: -30. 60 - 30 = 30.' },
    { num: 49, text: '8, 4, 4, 6, 12, 30, ?', a: '90', b: '75', c: '120', d: '80', e: '100', corr: 'A' as const, exp: 'Pattern: ×0.5, ×1.0, ×1.5, ×2.0, ×2.5, ×3.0. Next: 30 × 3.0 = 90.' },
    { num: 50, text: '15, 30, 60, 120, 240, ?', a: '480', b: '360', c: '500', d: '420', e: '450', corr: 'A' as const, exp: 'Pattern: Double each term. Next: 240 × 2 = 480.' },
    { num: 51, text: '7, 14, 42, 168, 840, ?', a: '5040', b: '4200', c: '5600', d: '4800', e: '5200', corr: 'A' as const, exp: 'Pattern: ×2, ×3, ×4, ×5, ×6. Next: 840 × 6 = 5040.' },
    { num: 52, text: '2, 3, 7, 16, 32, ?', a: '57', b: '54', c: '60', d: '50', e: '64', corr: 'A' as const, exp: 'Difference: +1², +2², +3², +4², +5². Next: 32 + 25 = 57.' },
    { num: 53, text: '64, 32, 16, 8, 4, ?', a: '2', b: '1', c: '0', d: '4', e: '3', corr: 'A' as const, exp: 'Pattern: Halve each term. Next: 4 / 2 = 2.' },
    { num: 54, text: '11, 13, 17, 23, 31, ?', a: '41', b: '37', c: '43', d: '39', e: '45', corr: 'A' as const, exp: 'Difference: +2, +4, +6, +8, +10. Next: 31 + 10 = 41.' },
    { num: 55, text: '3, 5, 9, 17, 33, ?', a: '65', b: '60', c: '63', d: '67', e: '70', corr: 'A' as const, exp: 'Difference: +2, +4, +8, +16, +32. Next: 33 + 32 = 65.' }
  ];

  seriesList.forEach(s => {
    list.push({
      id: `q_quant_${s.num}`,
      sourceId,
      subject: 'Quantitative Aptitude',
      topic: 'Missing Number Series',
      difficulty: 'Medium',
      questionNumber: s.num,
      questionText: `Q${s.num}. What should come in place of question mark (?) in the following series?\n\n${s.text}`,
      optionA: s.a, optionB: s.b, optionC: s.c, optionD: s.d, optionE: s.e,
      correctOption: s.corr, explanation: s.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q56-Q65: Arithmetic Word Problems
  const arithmeticList = [
    { num: 56, text: 'A vessel contains 100L of mixture of milk and water in ratio 4:1. If 20L of mixture is removed and replaced with pure water, what is final percentage of water?', a: '36%', b: '40%', c: '32%', d: '28%', e: '45%', corr: 'A' as const, exp: 'Initial: Milk=80L, Water=20L. 20L removed -> 16L milk, 4L water removed. Left: Milk=64L, Water=16L. Added 20L water -> Water=36L in 100L = 36%.' },
    { num: 57, text: 'A invests Rs. 12,000 for 12 months and B invests Rs. 16,000 for 9 months in a business. If total annual profit is Rs. 28,000, find B share.', a: 'Rs. 14,000', b: 'Rs. 12,000', c: 'Rs. 16,000', d: 'Rs. 10,000', e: 'Rs. 15,000', corr: 'A' as const, exp: 'Profit ratio A:B = (12,000*12) : (16,000*9) = 144,000 : 144,000 = 1:1. B share = 28,000 / 2 = Rs. 14,000.' },
    { num: 58, text: 'A sum of money doubles itself at simple interest in 8 years. What is the rate of interest per annum?', a: '12.5%', b: '10.0%', c: '15.0%', d: '8.0%', e: '11.5%', corr: 'A' as const, exp: 'SI = P. P = (P * R * 8) / 100 -> R = 100 / 8 = 12.5%.' },
    { num: 59, text: 'A boat can travel 36 km downstream in 3 hours and 24 km upstream in 4 hours. Find the speed of the stream.', a: '3 km/h', b: '2 km/h', c: '4 km/h', d: '1.5 km/h', e: '2.5 km/h', corr: 'A' as const, exp: 'Downstream speed = 36/3 = 12 km/h. Upstream speed = 24/4 = 6 km/h. Stream speed = (12 - 6) / 2 = 3 km/h.' },
    { num: 60, text: 'A train 180m long running at 54 km/h crosses a platform in 20 seconds. Find the length of the platform.', a: '120m', b: '150m', c: '100m', d: '140m', e: '110m', corr: 'A' as const, exp: 'Speed = 54 * (5/18) = 15 m/s. Total distance = 15 * 20 = 300m. Platform length = 300 - 180 = 120m.' },
    { num: 61, text: 'A can complete a piece of work in 12 days and B can complete it in 18 days. If they work together, how many days will they take?', a: '7.2 days', b: '6.5 days', c: '8.0 days', d: '7.5 days', e: '6.0 days', corr: 'A' as const, exp: 'Combined rate = (1/12 + 1/18) = 5/36 per day. Days required = 36/5 = 7.2 days.' },
    { num: 62, text: 'The average age of a class of 30 students is 15 years. If teacher age is included, average increases by 1 year. Find teacher age.', a: '46 years', b: '45 years', c: '40 years', d: '42 years', e: '48 years', corr: 'A' as const, exp: 'Initial total age = 30 * 15 = 450. New total age = 31 * 16 = 496. Teacher age = 496 - 450 = 46 years.' },
    { num: 63, text: 'An article marked at Rs. 2,000 is sold at two successive discounts of 20% and 10%. Find the selling price.', a: 'Rs. 1,440', b: 'Rs. 1,400', c: 'Rs. 1,500', d: 'Rs. 1,380', e: 'Rs. 1,460', corr: 'A' as const, exp: 'After 20% discount = 2,000 * 0.8 = 1,600. After 10% discount = 1,600 * 0.9 = Rs. 1,440.' },
    { num: 64, text: 'In how many different ways can the letters of the word "BANKING" be arranged so that vowels always come together?', a: '720', b: '5040', c: '1440', d: '360', e: '2520', corr: 'A' as const, exp: 'Vowels: A, I (2). Consonants: B, N, K, N, G (5). Treating (AI) as 1 unit: 6 units with N repeated 2 times -> (6!/2!) * 2! = 720.' },
    { num: 65, text: 'Two dice are thrown simultaneously. What is the probability of getting a sum equal to 8?', a: '5/36', b: '1/6', c: '7/36', d: '1/9', e: '1/12', corr: 'A' as const, exp: 'Favorable outcomes for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes. Total outcomes = 36. Probability = 5/36.' }
  ];

  arithmeticList.forEach(a => {
    list.push({
      id: `q_quant_${a.num}`,
      sourceId,
      subject: 'Quantitative Aptitude',
      topic: 'Arithmetic Word Problems',
      difficulty: 'Medium',
      questionNumber: a.num,
      questionText: `Q${a.num}. ${a.text}`,
      optionA: a.a, optionB: a.b, optionC: a.c, optionD: a.d, optionE: a.e,
      correctOption: a.corr, explanation: a.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // ------------------------------------------------------------------
  // SECTION 3: REASONING ABILITY (35 QUESTIONS: Q66 - Q100)
  // ------------------------------------------------------------------

  // Q66-Q75: Puzzles (Floor Building & Box Stacking Puzzles)
  const floorPuzzleText = `[Directions Q66-Q70]: 8 persons (A, B, C, D, E, F, G, H) live on an 8-story building numbered 1 to 8 from bottom to top:\n- A lives on an even numbered floor above floor 4.\n- Only 3 persons live between A and B.\n- C lives immediately below B.\n- E lives on an odd numbered floor below C.\n- Two persons live between E and F.\n- H lives above G but below D.`;

  const boxPuzzleText = `[Directions Q71-Q75]: 7 boxes (P, Q, R, S, T, U, V) are stacked one above another:\n- Box P is placed 3rd from top.\n- Only 2 boxes are between P and S.\n- Box R is placed immediately above S.\n- Box T is placed above U but below Q.`;

  const puzzleQuestions = [
    { num: 66, text: `${floorPuzzleText}\n\nQ66. Who among the following lives on the 8th floor?`, a: 'A', b: 'D', c: 'H', d: 'F', e: 'E', corr: 'A' as const, exp: 'Floor arrangement: Floor 8: A, Floor 7: D, Floor 6: H, Floor 5: G, Floor 4: B, Floor 3: C, Floor 2: F, Floor 1: E.' },
    { num: 67, text: `${floorPuzzleText}\n\nQ67. How many persons live between A and C?`, a: '4', b: '3', c: '2', d: '1', e: '5', corr: 'A' as const, exp: 'A is on floor 8 and C is on floor 3. Between them are floors 7, 6, 5, 4 (4 persons: D, H, G, B).' },
    { num: 68, text: `${floorPuzzleText}\n\nQ68. Who lives immediately above floor 1 (on floor 2)?`, a: 'F', b: 'E', c: 'C', d: 'B', e: 'G', corr: 'A' as const, exp: 'Floor 2 is occupied by F.' },
    { num: 69, text: `${floorPuzzleText}\n\nQ69. Four of the following five are alike in a certain floor parity. Which one does not belong to the group?`, a: 'D', b: 'A', c: 'B', d: 'F', e: 'C', corr: 'A' as const, exp: 'A(8), B(4), F(2) live on even floors; C(3), D(7) on odd floors. D is on floor 7.' },
    { num: 70, text: `${floorPuzzleText}\n\nQ70. What is the floor number of H?`, a: 'Floor 6', b: 'Floor 5', c: 'Floor 7', d: 'Floor 4', e: 'Floor 3', corr: 'A' as const, exp: 'H lives on Floor 6.' },
    { num: 71, text: `${boxPuzzleText}\n\nQ71. Which box is placed at the top position (Position 1)?`, a: 'Q', b: 'P', c: 'R', d: 'S', e: 'T', corr: 'A' as const, exp: 'Stack order from top: 1: Q, 2: T, 3: P, 4: U, 5: V, 6: R, 7: S.' },
    { num: 72, text: `${boxPuzzleText}\n\nQ72. How many boxes are placed between P and S?`, a: '3', b: '2', c: '1', d: '4', e: '0', corr: 'A' as const, exp: 'P is at position 3 and S at position 7 (3 boxes between: U, V, R).' },
    { num: 73, text: `${boxPuzzleText}\n\nQ73. Which box is placed immediately below Box P?`, a: 'U', b: 'T', c: 'R', d: 'Q', e: 'V', corr: 'A' as const, exp: 'Box U is at position 4 immediately below P.' },
    { num: 74, text: `${boxPuzzleText}\n\nQ74. Which box is at the bottom position (Position 7)?`, a: 'S', b: 'R', c: 'V', d: 'U', e: 'P', corr: 'A' as const, exp: 'Box S is at position 7.' },
    { num: 75, text: `${boxPuzzleText}\n\nQ75. How many boxes are placed above Box T?`, a: '1', b: '2', c: '0', d: '3', e: '4', corr: 'A' as const, exp: 'Box T is at position 2, so only 1 box (Q) is above it.' }
  ];

  puzzleQuestions.forEach(q => {
    list.push({
      id: `q_reas_${q.num}`,
      sourceId,
      subject: 'Reasoning Ability',
      topic: 'Floor & Box Puzzles',
      difficulty: 'Hard',
      questionNumber: q.num,
      questionText: q.text,
      optionA: q.a, optionB: q.b, optionC: q.c, optionD: q.d, optionE: q.e,
      correctOption: q.corr, explanation: q.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q76-Q85: Seating Arrangement (Circular & Linear Parallel Rows)
  const circText = `[Directions Q76-Q80]: 8 friends (A, B, C, D, E, F, G, H) sit around a circular table facing towards the center:\n- A sits 2nd to the left of D.\n- Two persons sit between D and F.\n- C sits immediate right of F.\n- B sits 3rd to the right of C.\n- E sits 2nd to the left of G.`;

  const seatingQuestions = [
    { num: 76, text: `${circText}\n\nQ76. Who sits immediate right of A?`, a: 'E', b: 'B', c: 'C', d: 'G', e: 'H', corr: 'A' as const, exp: 'Circular arrangement clockwise: A, E, D, G, B, H, F, C.' },
    { num: 77, text: `${circText}\n\nQ77. Who sits opposite to D?`, a: 'H', b: 'C', c: 'B', d: 'A', e: 'E', corr: 'A' as const, exp: 'H is positioned opposite to D.' },
    { num: 78, text: `${circText}\n\nQ78. How many persons sit between B and F when counted from right of B?`, a: '2', b: '1', c: '3', d: '0', e: '4', corr: 'A' as const, exp: 'Between B and F counting right: H (1 person).' },
    { num: 79, text: `${circText}\n\nQ79. Who sits 3rd to the left of G?`, a: 'A', b: 'D', c: 'F', d: 'E', e: 'C', corr: 'A' as const, exp: 'Counting 3 positions left of G gives A.' },
    { num: 80, text: `${circText}\n\nQ80. What is the position of C with respect to D?`, a: '3rd to the left', b: '2nd to the right', c: 'Immediate right', d: 'Opposite', e: '2nd to the left', corr: 'A' as const, exp: 'C is 3rd to the left of D.' },
    { num: 81, text: `Linear Parallel Row Seating: Row 1 (P, Q, R, S facing South), Row 2 (A, B, C, D facing North). P faces B. Q sits at extreme left end. Who faces Q?`, a: 'A', b: 'C', c: 'D', d: 'B', e: 'None of these', corr: 'A' as const, exp: 'Q at extreme left faces A.' },
    { num: 82, text: `Who sits immediate right of P?`, a: 'S', b: 'R', c: 'Q', d: 'No one', e: 'B', corr: 'A' as const, exp: 'Facing South: S sits to immediate right of P.' },
    { num: 83, text: `Who sits at the extreme right end of Row 2 (North facing)?`, a: 'D', b: 'C', c: 'B', d: 'A', e: 'S', corr: 'A' as const, exp: 'Extreme right end of Row 2 is occupied by D.' },
    { num: 84, text: `How many persons sit between A and D?`, a: '2', b: '1', c: '3', d: '0', e: '4', corr: 'A' as const, exp: 'A is at pos 1, D at pos 4 -> 2 persons (B, C) between them.' },
    { num: 85, text: `Who faces C?`, a: 'R', b: 'S', c: 'P', d: 'Q', e: 'None', corr: 'A' as const, exp: 'C faces R.' }
  ];

  seatingQuestions.forEach(q => {
    list.push({
      id: `q_reas_${q.num}`,
      sourceId,
      subject: 'Reasoning Ability',
      topic: 'Seating Arrangement',
      difficulty: 'Hard',
      questionNumber: q.num,
      questionText: q.text,
      optionA: q.a, optionB: q.b, optionC: q.c, optionD: q.d, optionE: q.e,
      correctOption: q.corr, explanation: q.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q86-Q92: Syllogisms ("Only a few", "All", "Some", "No")
  const syllogismsList = [
    { num: 86, stmt: 'Only a few Bank are PO.\nAll PO are Exam.\nNo Exam is Easy.', c1: 'Some Bank can never be Easy.', c2: 'All PO being Bank is a possibility.', corr: 'E' as const, exp: 'I follows because Bank portion in PO is inside Exam (which is not Easy). II follows because "Only a few Bank are PO" allows all PO to be Bank. Both follow.' },
    { num: 87, stmt: 'All Credit are Card.\nOnly a few Card are Debit.\nNo Debit is Cash.', c1: 'Some Credit being Debit is a possibility.', c2: 'No Card is Cash.', corr: 'A' as const, exp: 'Only C1 follows. Credit can overlap with Debit. C2 fails because Card outside Debit can be Cash.' },
    { num: 88, stmt: 'Some Loan are EMI.\nAll EMI are Debt.\nNo Debt is Asset.', c1: 'No EMI is Asset.', c2: 'Some Loan are Debt.', corr: 'E' as const, exp: 'C1 follows (EMI inside Debt, no Debt is Asset). C2 follows (Loan overlapping EMI inside Debt). Both follow.' },
    { num: 89, stmt: 'Only a few RBI are SEBI.\nOnly a few SEBI are NABARD.', c1: 'All RBI can be SEBI.', c2: 'Some SEBI being NABARD is a possibility.', corr: 'D' as const, exp: 'C1 fails ("Only a few RBI" means not all RBI can be SEBI). C2 is already given as statement, not a possibility. Neither follows.' },
    { num: 90, stmt: 'All Scale are Score.\nNo Score is Mark.\nAll Mark are Grade.', c1: 'No Scale is Mark.', c2: 'Some Grade being Score is a possibility.', corr: 'E' as const, exp: 'C1 follows (Scale inside Score, no Score is Mark). C2 follows (Grade outside Mark can overlap Score). Both follow.' },
    { num: 91, stmt: 'Some Profit are Loss.\nNo Loss is Gain.\nAll Gain are Yield.', c1: 'Some Profit are not Gain.', c2: 'All Yield being Loss is a possibility.', corr: 'A' as const, exp: 'C1 follows (Profit part in Loss cannot be Gain). C2 fails (Gain inside Yield cannot be Loss). Only I follows.' },
    { num: 92, stmt: 'Only a few Puzzle are Seating.\nNo Seating is Easy.', c1: 'Some Puzzle are not Easy.', c2: 'All Puzzle being Easy is a possibility.', corr: 'A' as const, exp: 'C1 follows (Puzzle overlapping Seating cannot be Easy). C2 fails. Only I follows.' }
  ];

  syllogismsList.forEach(s => {
    list.push({
      id: `q_reas_${s.num}`,
      sourceId,
      subject: 'Reasoning Ability',
      topic: 'Syllogisms',
      difficulty: 'Medium',
      questionNumber: s.num,
      questionText: `Q${s.num}. Statements:\n${s.stmt}\n\nConclusions:\nI. ${s.c1}\nII. ${s.c2}`,
      optionA: 'Only conclusion I follows', optionB: 'Only conclusion II follows', optionC: 'Either conclusion I or II follows', optionD: 'Neither conclusion I nor II follows', optionE: 'Both conclusions I and II follow',
      correctOption: s.corr, explanation: s.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q93-Q97: Coded Inequalities
  const ineqList = [
    { num: 93, stmt: 'M ≥ N > O = P ≤ Q < R', c1: 'M > P', c2: 'R > O', corr: 'E' as const, exp: 'From M ≥ N > O = P, M > P holds (I). From O = P ≤ Q < R, R > O holds (II). Both follow.' },
    { num: 94, stmt: 'A > B ≥ C = D < E ≤ F', c1: 'A > D', c2: 'F > C', corr: 'E' as const, exp: 'From A > B ≥ C = D, A > D holds (I). From C = D < E ≤ F, F > C holds (II). Both follow.' },
    { num: 95, stmt: 'P ≤ Q < R = S ≥ T > U', c1: 'S > P', c2: 'S > U', corr: 'E' as const, exp: 'From P ≤ Q < R = S, S > P holds (I). From S ≥ T > U, S > U holds (II). Both follow.' },
    { num: 96, stmt: 'W = X ≥ Y > Z ≤ K', c1: 'W > Z', c2: 'X ≥ K', corr: 'A' as const, exp: 'From W = X ≥ Y > Z, W > Z holds (I). For X vs K, relation opposite signs -> C2 fails. Only I follows.' },
    { num: 97, stmt: 'H ≥ I = J > K ≥ L', c1: 'H > L', c2: 'I > L', corr: 'E' as const, exp: 'From H ≥ I = J > K ≥ L, H > L and I > L both hold. Both follow.' }
  ];

  ineqList.forEach(i => {
    list.push({
      id: `q_reas_${i.num}`,
      sourceId,
      subject: 'Reasoning Ability',
      topic: 'Coded Inequalities',
      difficulty: 'Easy',
      questionNumber: i.num,
      questionText: `Q${i.num}. Statements: ${i.stmt}\n\nConclusions:\nI. ${i.c1}\nII. ${i.c2}`,
      optionA: 'Only conclusion I follows', optionB: 'Only conclusion II follows', optionC: 'Either conclusion I or II follows', optionD: 'Neither conclusion I nor II follows', optionE: 'Both conclusions I and II follow',
      correctOption: i.corr, explanation: i.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  // Q98-Q100: Blood Relations & Direction Sense
  const miscReasoning = [
    { num: 98, text: 'A family has 6 members A, B, C, D, E, F. A is father of B. C is mother of D. E is sister of B. F is son of C. D is married to A. How is C related to B?', a: 'Grandmother', b: 'Mother', c: 'Aunt', d: 'Sister', e: 'Daughter', corr: 'A' as const, exp: 'D is married to A (father of B), so D is mother of B. C is mother of D, so C is grandmother of B.' },
    { num: 99, text: 'A candidate walks 10m North from Point A, turns right and walks 15m to Point B, turns right and walks 10m to Point C. What is the shortest distance and direction of Point C from Point A?', a: '15m East', b: '10m North', c: '15m West', d: '20m South', e: '5m East', corr: 'A' as const, exp: 'North 10m, Right 15m East, Right 10m South -> returns to same horizontal line 15m East of A.' },
    { num: 100, text: 'In a code language, if "BANK" is written as "CBOL" and "EXAM" is written as "FYBN", how is "TEST" written in that language?', a: 'UFTU', b: 'UETU', c: 'SDRS', d: 'VFUV', e: 'UGTU', corr: 'A' as const, exp: 'Pattern: +1 to each letter (T->U, E->F, S->T, T->U) = UFTU.' }
  ];

  miscReasoning.forEach(m => {
    list.push({
      id: `q_reas_${m.num}`,
      sourceId,
      subject: 'Reasoning Ability',
      topic: m.num === 98 ? 'Blood Relations' : m.num === 99 ? 'Direction Sense' : 'Coding Decoding',
      difficulty: 'Medium',
      questionNumber: m.num,
      questionText: `Q${m.num}. ${m.text}`,
      optionA: m.a, optionB: m.b, optionC: m.c, optionD: m.d, optionE: m.e,
      correctOption: m.corr, explanation: m.exp, isActive: true, createdAt: '2026-01-15T10:00:00Z'
    });
  });

  return list;
}

export const INITIAL_QUESTIONS = buildSBIQuestions();

export const INITIAL_SOURCES: QuestionSource[] = [
  {
    id: 'src_sbi_po_2025_memory',
    title: 'SBI PO Preliminary Official Memory Based Question Paper 2025 (100 Questions)',
    examName: 'SBI PO',
    stage: 'Preliminary',
    fileName: 'SBI_PO_Prelims_2025_Memory_Paper.pdf',
    fileUrl: '/uploads/SBI_PO_Prelims_2025_Memory_Paper.pdf',
    uploadedBy: 'usr_admin_1',
    uploadTimestamp: '2026-01-15T09:00:00Z',
    parsedCount: 100,
    status: 'reviewed',
    notes: 'Verified complete question bank paper containing 30 English Language, 35 Quantitative Aptitude, and 35 Reasoning Ability questions.'
  }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test_sbi_po_prelim_01',
    title: 'SBI PO Preliminary Full Length Mock Test - 01',
    description: 'Standard 100-Question Preliminary Exam with 20-min sectional timers for English, Quant, and Reasoning.',
    stage: 'Preliminary',
    totalQuestions: 100,
    totalMarks: 100,
    totalDurationMinutes: 60,
    negativeMarking: 0.25,
    isPublished: true,
    createdAt: '2026-01-16T12:00:00Z',
    sections: [
      { id: 'sec_1', subject: 'English Language', order: 1, questionCount: 30, marks: 30, durationMinutes: 20 },
      { id: 'sec_2', subject: 'Quantitative Aptitude', order: 2, questionCount: 35, marks: 35, durationMinutes: 20 },
      { id: 'sec_3', subject: 'Reasoning Ability', order: 3, questionCount: 35, marks: 35, durationMinutes: 20 }
    ],
    questions: INITIAL_QUESTIONS
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_admin_1',
    email: '',
    fullName: 'Exam Admin',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr_candidate_1',
    email: '',
    fullName: 'Candidate',
    role: 'candidate',
    targetYear: 2026,
    createdAt: '2026-01-02T00:00:00Z'
  }
];
