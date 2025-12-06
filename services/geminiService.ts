import { GoogleGenAI, Schema, Type } from "@google/genai";
import { GameType, MathProblem } from "../types";

export const generateGameProblems = async (
  grade: number,
  gameType: GameType,
  count: number = 5,
  difficulty?: 'Easy' | 'Medium' | 'Hard',
  topicFocus?: string,
  reviewContext?: string
): Promise<MathProblem[]> => {
  const modelId = 'gemini-2.5-flash';
  
  let promptContext = "";
  const isHighSchool = grade >= 10;
  
  // Base context based on Game Type
  switch (gameType) {
    // --- MATH GAMES ---
    case GameType.MENTAL_MATH:
      if (isHighSchool) {
        promptContext = `Generate ${count} math problems for Grade ${grade} High School in Vietnam. 
        CRITICAL FORMATTING: Use standard LaTeX wrapped in single dollar signs $ for ALL mathematical expressions, variables, and formulas.
        Example: "Find the root of $x^2 - 4 = 0$" or "Calculate $\\int_{0}^{1} x dx$".
        Focus on:
        - Grade 10: Set theory ($A \\cap B$), Quadratic equations, Vectors ($\\vec{a} \\cdot \\vec{b}$).
        - Grade 11: Trigonometric values ($\\sin(x)$, $\\cos(x)$), Limits ($\\lim_{x \\to 0}$), Probability.
        - Grade 12: Functions (Derivatives $f'(x)$), Integrals ($\\int$), Complex numbers ($z = a + bi$).`;
      } else {
        promptContext = `Generate ${count} mental math problems suitable for a Grade ${grade} student in Vietnam. 
        Focus on arithmetic, speed calculation, and number properties. 
        FORMATTING: Use LaTeX wrapped in $ for any equations (e.g., $15 \\times 4 = ?$).`;
      }
      break;
    case GameType.LOGIC_PUZZLE:
      promptContext = `Generate ${count} logic puzzles suitable for Grade ${grade}.
      
      CRITICAL FORMATTING INSTRUCTION:
      The 'question' field MUST be a multi-line string:
      Line 1: A short text instruction in Vietnamese.
      Line 2+: The visual puzzle content using Emojis (🍎, 🚗, ⭐) or Numbers/Shapes arranged in a vertical equation or pattern.

      CRITICAL OPTION INSTRUCTION:
      The 'options' MUST be purely visual:
      - It MUST be a single Number (e.g. "5") OR a single Emoji (e.g. "🍎").
      - ABSOLUTELY NO DESCRIPTIVE TEXT in options.

      CRITICAL EXPLANATION INSTRUCTION:
      The 'explanation' MUST use the actual Emojis/Symbols from the question to explain the logic clearly.
      Example: "Vì 🍎 + 🍎 = 10 nên 🍎 = 5."`;
      break;
    case GameType.REAL_WORLD:
      if (isHighSchool) {
         promptContext = `Generate ${count} real-world math problems for Grade ${grade} High School (THPT).
         FORMATTING: Use LaTeX wrapped in $ for math expressions.
         Topics: Optimization ($f(x)_{max}$), Physics applications ($v(t)$), Finance ($A = P(1+r)^n$).
         Context: Authentic Vietnamese scenarios.`;
      } else {
         promptContext = `Generate ${count} real-world math word problems suitable for a Grade ${grade} student in Vietnam. 
         CRITICAL INSTRUCTION: Infuse the problems with deeply authentic Vietnamese cultural context.
         Use LaTeX wrapped in $ for amounts or calculations (e.g., $50.000$đ, $2.5$kg).`;
      }
      break;
    case GameType.TOWER_STACK:
      promptContext = `Generate ${count} math problems related to ordering numbers or missing sequences. Suitable for Grade ${grade}. 
      FORMATTING: Use LaTeX wrapped in $ for sequences (e.g., $2, 4, 6, ?$).`;
      break;
    case GameType.VISUAL_COUNT:
      promptContext = `Generate ${count} visual math problems using Emojis (🍎, 🍌, 🐱, ⭐, 🎈) to represent quantities or simple equations. Example: '🍎🍎 + 🍎 = ?'. 
      CRITICAL EXPLANATION: Use emojis in the explanation text.`;
      break;

    // --- LITERATURE GAMES ---
    case GameType.WORD_MATCH:
      if (isHighSchool) {
        promptContext = `Generate ${count} Vietnamese language questions for Grade ${grade} (High School). Focus on Han-Viet words, Literary styles, Rhetorical devices.`;
      } else {
        promptContext = `Generate ${count} Vietnamese language questions for Grade ${grade}. Focus on Synonyms, Antonyms, Idioms.`;
      }
      break;
    case GameType.POETRY_PUZZLE:
      promptContext = `Generate ${count} 'fill-in-the-blank' questions using famous Vietnamese poems or folk verses (Ca dao) taught in Grade ${grade}.`;
      break;
    case GameType.SPELLING_BEE:
      promptContext = `Generate ${count} Vietnamese spelling (Chính tả) questions for Grade ${grade}. Focus on common confusions (ch/tr, s/x).`;
      break;
    case GameType.LITERATURE_QUIZ:
      promptContext = `Generate ${count} multiple choice questions about Vietnamese literature knowledge suitable for Grade ${grade}.`;
      break;
    case GameType.SENTENCE_BUILDER:
      promptContext = `Generate ${count} Vietnamese sentence structure questions for Grade ${grade}. Task: Provide scrambled words/phrases.`;
      break;
    case GameType.LITERARY_DETECTIVE:
      promptContext = `Generate ${count} questions about Vietnamese literary devices (Biện pháp tu từ).`;
      break;
    case GameType.WORD_SEARCH:
      promptContext = `Generate ${count} sets of words for a Crossword/Word Search game for Grade ${grade}.
      Structure: 'question' is Topic Name, 'options' is list of words. Explanation is a fun fact.
      IMPORTANT: If 'topicFocus' is English, generate English words. Else Vietnamese.`;
      break;
    case GameType.CROSSWORD:
      promptContext = `Generate ${count} Crossword Puzzle data sets suitable for Grade ${grade}.
      Structure: 'options' is a list of exactly 6 "WORD|Clue" strings.
      IMPORTANT: If English topic, Words MUST be English.`;
      break;

    // --- ENGLISH GAMES ---
    case GameType.ENGLISH_VOCAB:
      promptContext = `Generate ${count} English Vocabulary questions for Vietnamese students Grade ${grade}.
      CRITICAL: The Explanation field MUST be in Vietnamese.`;
      break;
    case GameType.ENGLISH_GRAMMAR:
      promptContext = `Generate ${count} English Grammar questions for Vietnamese students Grade ${grade}.
      CRITICAL: The Explanation field MUST be in Vietnamese explaining the grammar rule.`;
      break;
    case GameType.ENGLISH_SPELLING:
      promptContext = `Generate ${count} English Spelling questions for Vietnamese students Grade ${grade}.`;
      break;
    case GameType.ENGLISH_QUIZ:
      promptContext = `Generate ${count} General English Knowledge questions for Vietnamese students Grade ${grade}.`;
      break;
      
    // --- SCIENCE & HISTORY (Grade 6-12) ---
    case GameType.PHYSICS_QUIZ:
      promptContext = `Generate ${count} Physics questions for Grade ${grade} in Vietnam (Vật Lý).
      FORMATTING: Use LaTeX wrapped in $ for formulas, units, and values (e.g. $F = ma$, $9.8 m/s^2$).
      Topics: Mechanics, Optics, Electricity, Thermodynamics.
      CRITICAL: Explanation must be in Vietnamese.`;
      break;
    
    case GameType.CHEMISTRY_LAB:
      promptContext = `Generate ${count} Chemistry questions for Grade ${grade} in Vietnam (Hóa Học).
      FORMATTING: Use LaTeX wrapped in $ for chemical formulas (e.g. $H_2SO_4$, $CO_2$).
      Topics: Reactions, Periodic Table, Organic Chemistry.
      CRITICAL: Explanation must be in Vietnamese.`;
      break;
      
    case GameType.BIOLOGY_LIFE:
      promptContext = `Generate ${count} Biology questions for Grade ${grade} in Vietnam (Sinh Học).
      Topics: Cells, Genetics, Evolution, Human Body.
      CRITICAL: Explanation must be in Vietnamese.`;
      break;
      
    case GameType.HISTORY_TIMELINE:
      promptContext = `Generate ${count} History questions for Grade ${grade} in Vietnam (Lịch Sử).
      Topics: Vietnamese History and World History.
      CRITICAL: Explanation must be in Vietnamese.`;
      break;

    // --- SPECIAL MIXED MODE ---
    case GameType.MIXED_CHALLENGE:
      promptContext = `Generate ${count} mixed questions for Grade ${grade}.
      33% Math (Use LaTeX $...$), 33% Lit, 33% English.
      CRITICAL: Explanations must be in Vietnamese.`;
      
      if (!difficulty) {
        promptContext += ` - CRITICAL: The difficulty MUST increase progressively from Easy to Hard.`;
      }
      break;
  }

  // Handle Review Mode
  if (reviewContext) {
    promptContext += ` SPECIAL INSTRUCTION: This is a REVIEW session. Focus on: ${reviewContext}.`;
  }

  // Add Specific Difficulty Modifier
  if (difficulty && !reviewContext) {
    promptContext += ` STRICTLY ensure all problems are of '${difficulty}' difficulty level.`;
  } else if (!difficulty && gameType !== GameType.MIXED_CHALLENGE && !reviewContext) {
    promptContext += ` Provide a mix of difficulties.`;
  }

  if (topicFocus && topicFocus.trim() !== '') {
    promptContext += ` SPECIFICALLY focus the problems on the topic: "${topicFocus}".`;
  }

  const prompt = `${promptContext} Return the result as a JSON array. ensure the language is natural Vietnamese (except for English question content).`;

  // --- HYBRID STRATEGY ---
  
  // STRATEGY 1: Try Serverless API (Preferred for Vercel/Production)
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, modelId })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        const cleanJson = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson) as MathProblem[];
      }
    }
  } catch (error) {
    console.warn("Serverless API call failed, falling back to Client SDK:", error);
  }

  // STRATEGY 2: Fallback to Client SDK (For Preview/Localhost or if Serverless fails)
  // This requires the API_KEY to be exposed in vite.config.ts define
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing for both Serverless and Client methods!");
    return [{
      question: "Lỗi kết nối: Không tìm thấy API Key",
      options: ["Thử lại", "Báo lỗi", "Đợi", "Thoát"],
      correctAnswerIndex: 0,
      explanation: "Vui lòng kiểm tra cấu hình Vercel (Environment Variables).",
      difficulty: "Easy"
    }];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation", "difficulty"],
          },
        },
        temperature: 0.7,
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as MathProblem[];

  } catch (error) {
    console.error("Client SDK Error:", error);
    return [{
      question: "Có lỗi khi tạo câu hỏi. Vui lòng thử lại.",
      options: ["Thử lại", "Thoát", "Đợi", "Báo lỗi"],
      correctAnswerIndex: 0,
      explanation: "Hệ thống AI đang bận hoặc gặp sự cố kết nối.",
      difficulty: "Easy"
    }];
  }
};