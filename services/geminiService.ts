
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameType, MathProblem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const problemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The question text (math problem, literature question, or english question) in the appropriate language.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4 possible answers.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-3) of the correct answer in the options array.",
    },
    explanation: {
      type: Type.STRING,
      description: "A short explanation of the solution in Vietnamese (even for English questions, explain why in Vietnamese).",
    },
    difficulty: {
      type: Type.STRING,
      enum: ["Easy", "Medium", "Hard"],
      description: "The difficulty level of the problem.",
    }
  },
  required: ["question", "options", "correctAnswerIndex", "explanation", "difficulty"],
};

export const generateGameProblems = async (
  grade: number,
  gameType: GameType,
  count: number = 5,
  difficulty?: 'Easy' | 'Medium' | 'Hard',
  topicFocus?: string,
  reviewContext?: string // New param for Review Mode
): Promise<MathProblem[]> => {
  const modelId = 'gemini-2.5-flash';
  
  let promptContext = "";
  
  // Base context based on Game Type
  switch (gameType) {
    // --- MATH GAMES ---
    case GameType.MENTAL_MATH:
      promptContext = `Generate ${count} mental math problems suitable for a Grade ${grade} student in Vietnam. Focus on arithmetic, speed calculation, and number properties. Avoid complex word problems.`;
      break;
    case GameType.LOGIC_PUZZLE:
      promptContext = `Generate ${count} logic puzzles suitable for Grade ${grade}.
      
      CRITICAL FORMATTING INSTRUCTION:
      The 'question' field MUST be a multi-line string:
      Line 1: A short text instruction in Vietnamese (e.g. "Tìm giá trị của quả táo", "Điền hình còn thiếu", "Kết quả là bao nhiêu?").
      Line 2+: The visual puzzle content using Emojis (🍎, 🚗, ⭐) or Numbers/Shapes arranged in a vertical equation or pattern.

      CRITICAL OPTION INSTRUCTION:
      The 'options' MUST be purely visual to act as game tiles:
      - It MUST be a single Number (e.g. "5") OR a single Emoji (e.g. "🍎").
      - ABSOLUTELY NO DESCRIPTIVE TEXT in options.
      - INCORRECT: "Số 5", "Quả táo đỏ", "Hình tam giác".
      - CORRECT: "5", "🍎", "🔺".

      CRITICAL EXPLANATION INSTRUCTION:
      The 'explanation' MUST use the actual Emojis/Symbols from the question to explain the logic clearly.
      Example: "Vì 🍎 + 🍎 = 10 nên 🍎 = 5."
      Keep the explanation step-by-step and purely visual where possible.

      Example 1 (Equation):
      Question:
      "Mỗi quả táo có giá trị bao nhiêu?
      🍎 + 🍎 = 10
      🍎 + 🍌 = 8
      🍌 = ?"
      Options: ["3", "4", "5", "6"]

      Example 2 (Pattern):
      Question:
      "Tìm hình tiếp theo của dãy quy luật:
      🔴 🔵 🔴 🔵 ❓"
      Options: ["🔴", "🔵", "🟢", "🟡"]

      Requirements:
      1. Use purely visual elements (Emojis/Shapes) for the puzzle part.
      2. Ensure the text instruction is clear and simple for the grade level.
      3. For Grade 1-3: Use simple addition/subtraction with fruit/animal icons.
      4. For Grade 4+: Use patterns or simple logic series.
      `;
      break;
    case GameType.REAL_WORLD:
      promptContext = `Generate ${count} real-world math word problems suitable for a Grade ${grade} student in Vietnam. 
      CRITICAL INSTRUCTION: Infuse the problems with deeply authentic Vietnamese cultural context.
      Use scenarios such as:
      - Buying ingredients for traditional dishes like Phở, Bánh Mì, or Bánh Chưng at a local wet market (chợ).
      - Calculating 'Lì xì' (lucky money) during Tet holiday.
      - Organizing traditional games like 'Ô ăn quan' or 'Nhảy dây'.
      - School trips to historical sites like Văn Miếu or Dinh Độc Lập.
      - Using Vietnamese currency (đồng) realistically (e.g., 5.000đ, 20.000đ).
      - Sharing fruits like Lychee (vải), Longan (nhãn), or Durian (sầu riêng).`;
      break;
    case GameType.TOWER_STACK:
      promptContext = `Generate ${count} math problems related to ordering numbers (ascending/descending), comparing values (greater than, less than), or finding the missing step in a number sequence ladder. Suitable for Grade ${grade}. Format as multiple choice.`;
      break;
    case GameType.VISUAL_COUNT:
      promptContext = `Generate ${count} visual math problems using Emojis (🍎, 🍌, 🐱, ⭐, 🎈) to represent quantities or simple equations. Example: '🍎🍎 + 🍎 = ?' or 'Đếm số ngôi sao: ⭐⭐⭐'. Focus on counting and visual addition/subtraction. Suitable for Grade ${grade}. 
      CRITICAL EXPLANATION: Use emojis in the explanation text (e.g. "Có 3 🍎 và thêm 1 🍎...").`;
      break;

    // --- LITERATURE GAMES ---
    case GameType.WORD_MATCH:
      promptContext = `Generate ${count} Vietnamese language questions for Grade ${grade}. Focus on:
      - Synonyms and Antonyms (Từ đồng nghĩa, trái nghĩa).
      - Idioms and Proverbs (Thành ngữ, Tục ngữ Việt Nam).
      - Word sorting/reordering to make meaningful sentences.
      - Identifying the correct word type (Danh từ, Động từ, Tính từ).`;
      break;
    case GameType.POETRY_PUZZLE:
      promptContext = `Generate ${count} 'fill-in-the-blank' questions using famous Vietnamese poems or folk verses (Ca dao) taught in Grade ${grade} textbooks. 
      Example: "Công cha như núi ___ Sơn". Options: ["Thái", "Hồng", "Tản", "Hoàng"].
      Include works from authors like Trần Đăng Khoa, Tố Hữu, or classical folk poetry.`;
      break;
    case GameType.SPELLING_BEE:
      promptContext = `Generate ${count} Vietnamese spelling (Chính tả) questions for Grade ${grade}.
      Focus on common confusions:
      - 'ch' vs 'tr'
      - 's' vs 'x'
      - 'r', 'd', 'gi'
      - 'l' vs 'n'
      - Tone marks (dấu hỏi/ngã).
      Example: "Chọn từ đúng:" Options: ["Trâu", "Châu"].`;
      break;
    case GameType.LITERATURE_QUIZ:
      promptContext = `Generate ${count} multiple choice questions about Vietnamese literature knowledge suitable for Grade ${grade}.
      Topics:
      - Famous characters (Dế Mèn, Thánh Gióng, Thạch Sanh, Tấm Cám).
      - Authors and their works.
      - Reading comprehension of short passages regarding Vietnamese culture or history.`;
      break;
    case GameType.SENTENCE_BUILDER:
      promptContext = `Generate ${count} Vietnamese sentence structure questions for Grade ${grade}.
      Task: Provide a set of scrambled words/phrases and ask for the correct sentence structure.
      Example Question: "Sắp xếp: 'ăn / cơm / Tôi / đang'."
      Options: ["Tôi đang ăn cơm", "Tôi ăn cơm đang", "Cơm đang tôi ăn", "Ăn tôi đang cơm"].
      Focus on correct grammar, word order, and conjunction usage.`;
      break;
    case GameType.LITERARY_DETECTIVE:
      promptContext = `Generate ${count} questions about Vietnamese literary devices (Biện pháp tu từ) suitable for Grade ${grade}.
      Topics:
      - So sánh (Simile)
      - Nhân hóa (Personification)
      - Ẩn dụ (Metaphor)
      - Hoán dụ (Metonymy)
      - Điệp ngữ (Repetition)
      Example: "Câu thơ 'Người cha mái tóc bạc / Đốt lửa cho anh nằm' sử dụng biện pháp tu từ nào?"
      Options: ["Ẩn dụ", "So sánh", "Nhân hóa", "Hoán dụ"].`;
      break;
    case GameType.WORD_SEARCH:
      promptContext = `Generate ${count} sets of words for a Crossword/Word Search game for Grade ${grade}.
      Structure for each set (Problem):
      - 'question': The Topic Name in Vietnamese or English (e.g. "Chủ đề: Gia Đình" or "Topic: Animals").
      - 'options': A list of 4-6 vocabulary words related to that topic. Words must be 3-8 characters long, no spaces, no special punctuation (uppercase).
      - 'correctAnswerIndex': Set to 0.
      - 'explanation': A fun fact about the topic.
      
      IMPORTANT: If the 'topicFocus' appears to be English (e.g., 'Animals', 'Colors'), generate English words. If Vietnamese, generate Vietnamese words.`;
      break;
    case GameType.CROSSWORD:
      promptContext = `Generate ${count} Crossword Puzzle data sets suitable for Grade ${grade}.
      Each problem represents one full crossword puzzle on a specific topic.
      
      Structure:
      - 'question': The Topic Name (e.g., "Chủ đề: Lịch Sử" or "Topic: Fruits").
      - 'options': A list of exactly 6 Word+Clue pairs string formatted as "WORD|Clue Text".
        - The WORD must be 3-8 letters, no spaces, uppercase.
        - The Clue Text explains the word.
        - Example Option: "HANOI|Thủ đô của Việt Nam" or "APPLE|A red fruit".
      - 'correctAnswerIndex': 0.
      - 'explanation': A brief summary of the topic.
      
      IMPORTANT: Detect the language of the topicFocus. 
      - If English topic (e.g. 'Sports', 'Food'), Words MUST be English. Clues should be in Vietnamese (to test meaning) or simple English.
      - If Vietnamese topic, Words MUST be Vietnamese.`;
      break;

    // --- ENGLISH GAMES ---
    case GameType.ENGLISH_VOCAB:
      promptContext = `Generate ${count} English Vocabulary questions for Vietnamese students Grade ${grade}.
      Question types:
      - Choose the correct Vietnamese meaning for an English word.
      - Choose the correct English word for a Vietnamese definition.
      - Fill in the blank with the correct vocabulary word.
      CRITICAL: The Explanation field MUST be in Vietnamese to help the student learn.`;
      break;
    case GameType.ENGLISH_GRAMMAR:
      promptContext = `Generate ${count} English Grammar questions for Vietnamese students Grade ${grade}.
      Focus on curriculum appropriate topics (e.g., Verb Tenses, Prepositions, Articles, Pronouns).
      Example: "She ___ to school every day." Options: ["go", "goes", "going", "went"].
      CRITICAL: The Explanation field MUST be in Vietnamese explaining the grammar rule (e.g., "Vì chủ ngữ là 'She' nên động từ thêm 'es' ở thì hiện tại đơn").`;
      break;
    case GameType.ENGLISH_SPELLING:
      promptContext = `Generate ${count} English Spelling questions for Vietnamese students Grade ${grade}.
      Show a picture emoji or a Vietnamese word, and ask for the correct English spelling.
      Or show 4 similar spellings and ask to pick the correct one.
      Example: "Chọn từ đúng:" Options: ["Family", "Famaly", "Femily", "Fammily"].
      CRITICAL: The Explanation field MUST be in Vietnamese.`;
      break;
    case GameType.ENGLISH_QUIZ:
      promptContext = `Generate ${count} General English Knowledge questions for Vietnamese students Grade ${grade}.
      Topics: Basic conversation, Greetings, Culture of English speaking countries, or Reading Comprehension (short sentence).
      CRITICAL: The Explanation field MUST be in Vietnamese.`;
      break;

    // --- SPECIAL MIXED MODE ---
    case GameType.MIXED_CHALLENGE:
      promptContext = `Generate ${count} mixed questions for Grade ${grade} in Vietnam.
      Requirements:
      - 33% Math questions.
      - 33% Vietnamese Literature questions.
      - 33% English questions.
      - Randomly shuffle the order of topics.
      - CRITICAL: Explanations must be in Vietnamese.`;
      
      if (!difficulty) {
        promptContext += ` - CRITICAL: The difficulty MUST increase progressively from Easy to Hard.`;
      }
      break;
  }

  // Handle Review Mode
  if (reviewContext) {
    promptContext += ` SPECIAL INSTRUCTION: This is a REVIEW session. The student previously struggled with the following topics/types: ${reviewContext}. 
    CRITICAL: Generate problems specifically addressing these weak areas to help them improve. If the input suggests a specific game type, generate problems of that type but focus on tricky or commonly misunderstood concepts.`;
  }

  // Add Specific Difficulty Modifier
  if (difficulty && !reviewContext) {
    promptContext += ` STRICTLY ensure all problems are of '${difficulty}' difficulty level. Do not vary the difficulty.`;
  } else if (!difficulty && gameType !== GameType.MIXED_CHALLENGE && !reviewContext) {
    promptContext += ` Provide a mix of difficulties.`;
  }

  if (topicFocus && topicFocus.trim() !== '') {
    promptContext += ` SPECIFICALLY focus the problems on the topic: "${topicFocus}".`;
  }

  const prompt = `${promptContext} Return the result as a JSON array. ensure the language is natural Vietnamese (except for the English question content itself).`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: problemSchema
        },
        temperature: 0.7, // Moderate creativity for varied problems
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as MathProblem[];
  } catch (error) {
    console.error("Error generating problems:", error);
    // Fallback static problem in case of API error or quota limits
    return [{
      question: "Có lỗi kết nối. Vui lòng thử lại sau.",
      options: ["Thử lại", "Thoát", "Đợi", "Báo lỗi"],
      correctAnswerIndex: 0,
      explanation: "Hệ thống đang bận.",
      difficulty: "Easy"
    }];
  }
};
