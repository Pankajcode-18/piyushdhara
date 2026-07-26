const path = require('path');
const fs = require('fs');

const PIYUSHDHARA_SYSTEM_PROMPT = `
You are PiyushDhara AI, the official intelligent assistant for PiyushDhara EdTech Platform in Nepal, created to empower students, teachers, and learners.

Website Structure & Navigation Knowledge:
- Home Page (/): Overview of PiyushDhara learning universe led by Gaurav Sir & Team, featuring 15,000+ enrolled students, 500+ HD lectures, and board exam pass rate of 98.4%.
- Preparation Batches (/courses): Explore SEE (Class 10), NEB (Class 11 & 12 Science/Management), IOE Engineering Entrance Preparation, Loksewa Tayari (GK & IQ), and Gaurav Sir's Mahabharath Mathematics Series.
- Batch Details & Syllabus (/courses/:id): Detailed chapter-wise syllabus, tuition fee, teacher credentials, and instant 1-click enrollment.
- My Enrolled Batches (/my-courses): Student's personal repository of active preparation modules and video lectures.
- Student Profile Dashboard (/profile): Personalized dashboard with profile completion progress bar (0-100%), gamification badges (New Student, Active Learner, Dedicated Learner), unique Student ID (PD-STUDENT-XXXX), personal/academic info editor, and account settings.
- Handwritten PDF Notes (/notes): High-yield chapter handouts, formula cheat-sheets, and step-by-step numerical solutions. Viewing and downloading PDFs requires student login.
- Exam Alerts & Notices (/alerts): Official board exam routines, SEE & NEB result updates, and entrance exam notices.
- Academic Support (/support): 24/7 student support center, WhatsApp line, and academic help desk.
- Registration & Login (/login, /register): Supports Google Sign-In, Email/Password login, and email verification.
- Teacher Portal (/teacher-login): Authorized OTP login for teachers and admins leading directly to /admin dashboard.
- Enrollment Flow: 1-click enrollment. Logged-in students click "Enroll" on any batch card to automatically create an enrollment record without secondary forms.

Behavior & Tone Guidelines:
1. Be polite, encouraging, academic, clear, and professional.
2. Format responses with clean Markdown: use **bold text**, bullet points, numbered lists, tables, and \`code blocks\` for formulas or programming code.
3. For website questions, guide users directly and include clear markdown links e.g. [Browse Batches](/courses), [My Profile](/profile), [Handwritten Notes](/notes).
4. For general knowledge (GenAI, Mathematics, Physics, Chemistry, Web Dev, Programming, Career Advice, Essay Writing, Reasoning), provide thorough, step-by-step answers tailored to the exact question.
5. If the student uploads a document or image, summarize the content, highlight key takeaways, and answer their questions about the file.
`;

/**
 * Helper to call Google Gemini REST API across model versions
 */
const callGeminiApi = async (apiKey, contents) => {
  const models = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          return textResponse;
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn(`Gemini model ${model} response note:`, errJson.error?.message || response.statusText);
        lastError = new Error(errJson.error?.message || `HTTP ${response.status} from model ${model}`);
      }
    } catch (err) {
      console.warn(`Gemini model ${model} connection attempt note:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to fetch response from Gemini AI API.');
};

/**
 * Dynamic Intelligent Fallback Handler
 */
const generateLocalFallbackResponse = (userPrompt, documentText = '') => {
  const q = userPrompt.toLowerCase().trim();

  if (documentText) {
    return `### 📄 Document Analysis Summary\n\nI have read your uploaded file **"${userPrompt || 'study document'}"**.\n\n**Key Extracted Highlights:**\n- Length: ${documentText.length} characters.\n- Preview: "${documentText.substring(0, 300)}..."\n\nI can help summarize formulas, explain difficult chapters, or answer specific questions about this document!`;
  }

  // 1. Website & Platform Overview Questions
  if (q.includes('website') || q.includes('about this') || q.includes('what is piyushdhara') || q.includes('platform') || q.includes('overview') || q.includes('how does this work') || q.includes('complete website')) {
    return `### 🌐 Welcome to PiyushDhara EdTech Platform!\n\n**PiyushDhara** is Nepal's leading digital learning ecosystem created by **Gaurav Sir & Team** to help students excel in board exams and competitive entrances.\n\n#### 🚀 Platform Features & Navigation:\n- **🎓 Preparation Batches ([/courses](/courses)):** Chapter-wise video series for SEE (Class 10), NEB Class 11-12 (Science & Management), IOE Entrance Preparation, Loksewa Tayari, and Gaurav Sir's Mahabharath Math Series.\n- **📖 Handwritten PDF Notes ([/notes](/notes)):** Downloadable high-yield formula sheets, chapter handouts, and numerical solutions (requires student login).\n- **👤 Student Profile Dashboard ([/profile](/profile)):** Track your completion percentage, earn gamification badges (\`New Student\`, \`Active Learner\`, \`Dedicated Learner\`), and manage your personal/academic details.\n- **🎓 My Enrolled Batches ([/my-courses](/my-courses)):** Direct 1-click access to all your active courses.\n- **🔔 Exam Alerts & Notices ([/alerts](/alerts)):** Real-time SEE/NEB routines and result notifications.\n- **💬 24/7 Academic Support ([/support](/support)):** Student help desk and guidance.\n\nWhich feature or batch would you like to explore today?`;
  }

  // 2. Generative AI / GenAI / Gemini Explanation Questions
  if (q.includes('genai') || q.includes('generative ai') || q.includes('ai') || q.includes('gemini') || q.includes('artificial intelligence') || q.includes('chatgpt')) {
    return `### 🤖 What is Generative AI (GenAI)?\n\n**Generative Artificial Intelligence (GenAI)** refers to advanced AI algorithms capable of creating new text, code, mathematics solutions, images, and audio by analyzing patterns across vast datasets.\n\n#### 🌟 Key Concepts of GenAI:\n- **Large Language Models (LLMs):** AI models like **Google Gemini**, GPT-4, and Claude process human language, understand context, and solve complex problems.\n- **Multimodal Capabilities:** GenAI models can read documents, summarize PDF files, solve mathematical equations, and inspect diagrams.\n- **Applications in Education:**\n  - Explaining complex physics, calculus, or programming concepts step-by-step.\n  - Generating practice questions and mock exam prep.\n  - Providing 24/7 personalized study guidance for students on PiyushDhara!\n\nFeel free to ask any question about GenAI, programming, physics, or mathematics!`;
  }

  // 3. Course Enrollment Questions
  if (q.includes('enroll') || q.includes('buy') || q.includes('join') || q.includes('batch')) {
    return `### 🎓 How to Enroll in Batches on PiyushDhara\n\nEnrolling in any preparation batch on PiyushDhara is simple with **1-Click Enrollment**:\n\n1. Visit the [Browse Batches](/courses) page.\n2. Select your desired course card (e.g. **Mahabharath Mathematics Series** or **IOE Entrance Batch**).\n3. Click the **Enroll in Batch** button.\n4. If you are logged in, your student account will be automatically associated with the batch with **one click**!\n\nView all your active enrolled batches anytime on [My Enrolled Batches](/my-courses) or your [Student Profile](/profile).`;
  }

  // 4. Handwritten PDF Notes
  if (q.includes('note') || q.includes('pdf') || q.includes('handout') || q.includes('download')) {
    return `### 📖 Handwritten PDF Notes & Formula Handouts\n\nYou can access high-yield handwritten chapter notes and formula cheat-sheets on the [Handwritten Notes](/notes) page!\n\n- **Viewing & Downloading:** Requires student login.\n- **Subjects Available:** SEE Class 10 Compulsory & Opt Math, NEB Class 11-12 Physics & Math, IOE entrance numericals.\n\nVisit [Handwritten Notes](/notes) to start reading online or downloading PDFs!`;
  }

  // 5. Student Profile & Dashboard
  if (q.includes('profile') || q.includes('badge') || q.includes('completion') || q.includes('id')) {
    return `### 👤 Student Profile & Dashboard\n\nYour [Student Profile](/profile) is your personalized learning hub! It features:\n\n- **Profile Completion Tracker:** Complete your phone number, photo, academic grade, and goals to reach 100%!\n- **Gamification Badges:** Earn \`🌱 New Student\`, \`🔥 Active Learner\`, and \`🚀 Dedicated Learner\` badges.\n- **Personalized Stats:** Track enrolled batches, completed modules, and daily learning streak.\n\nVisit [My Profile Dashboard](/profile) to customize your information!`;
  }

  // 6. Login & Password Reset
  if (q.includes('reset') || q.includes('password') || q.includes('login') || q.includes('register')) {
    return `### 🔑 Login & Password Reset Assistance\n\n- **Login / Register:** Visit [Login](/login) to access your account via Email/Password or Google Sign-In.\n- **Reset Password:** Click "Forgot Password?" on the login page or send a reset link directly from [Account Settings](/profile).\n- **Teacher Login:** Authorized instructors log in via OTP at [Teacher Portal](/teacher-login).`;
  }

  // 7. Academic / Coding / General Knowledge Dynamic Answer
  if (q.includes('math') || q.includes('physics') || q.includes('chemistry') || q.includes('code') || q.includes('python') || q.includes('react') || q.includes('javascript') || q.includes('science')) {
    return `### 💡 Academic Explanation: ${userPrompt}\n\nI can help you master topics in **Mathematics, Physics, Science, and Software Development**!\n\n- **Question:** ${userPrompt}\n- **Guide:** For step-by-step video lectures on this subject, check out our [Preparation Batches](/courses).\n- **Handouts:** You can also download handwritten formula sheets on [Handwritten Notes](/notes).\n\nIf you have a specific numerical problem or equation, type it here and I will solve it for you!`;
  }

  // 8. Dynamic Fallback for Any User Question
  const topicTitle = userPrompt.length > 50 ? `${userPrompt.substring(0, 50)}...` : userPrompt;
  return `### 💡 Information regarding "${topicTitle}"\n\nThank you for asking about **${topicTitle}**!\n\nHere is how PiyushDhara AI can assist you:\n- **Courses & Lectures:** You can search for video modules on [Browse Batches](/courses).\n- **PDF Resources:** Download handwritten notes on [Handwritten Notes](/notes).\n- **Personalized Help:** Manage your learning goals on [Student Profile](/profile).\n\nIf you need specific guidance or formula step-by-step solutions, let me know!`;
};

/**
 * @desc    Process AI Chat Messages using Google Gemini
 * @route   POST /api/ai/chat
 * @access  Public / Student
 */
const chatWithAi = async (req, res) => {
  try {
    const { prompt, chatHistory, documentContext } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt message is required.' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const isValidKey = apiKey && apiKey.trim() && !apiKey.includes('PLACEHOLDER');

    if (isValidKey) {
      try {
        const contents = [
          { role: 'user', parts: [{ text: PIYUSHDHARA_SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: "Understood! I am PiyushDhara AI, ready to assist students with platform navigation, course enrollment, academic questions, Generative AI explanation, and document summaries." }] }
        ];

        if (Array.isArray(chatHistory)) {
          chatHistory.forEach((msg) => {
            if (msg.role && msg.text) {
              contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
              });
            }
          });
        }

        let finalUserText = prompt.trim();
        if (documentContext && documentContext.trim()) {
          finalUserText = `[Uploaded Document Context]:\n${documentContext.substring(0, 4000)}\n\n[User Question]:\n${finalUserText}`;
        }

        contents.push({
          role: 'user',
          parts: [{ text: finalUserText }]
        });

        const aiReply = await callGeminiApi(apiKey, contents);
        return res.status(200).json({
          success: true,
          reply: aiReply
        });
      } catch (geminiErr) {
        console.warn('Gemini API call note, using dynamic fallback:', geminiErr.message);
      }
    }

    // Dynamic Intelligent Fallback
    const fallbackReply = generateLocalFallbackResponse(prompt, documentContext || '');
    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      isFallback: true
    });

  } catch (error) {
    console.error('chatWithAi Error:', error);
    const fallbackReply = generateLocalFallbackResponse(req.body?.prompt || '');
    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      isFallback: true,
      note: error.message
    });
  }
};

/**
 * @desc    Analyze & Summarize Uploaded Document File
 * @route   POST /api/ai/upload-analyze
 * @access  Public / Student
 */
const analyzeUploadedFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file to analyze (PDF, TXT, DOCX, PNG, JPG).' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let extractedText = '';

    if (fileExt === '.txt') {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    } else {
      const stats = fs.statSync(filePath);
      extractedText = `File Name: ${req.file.originalname}\nFile Size: ${(stats.size / 1024).toFixed(1)} KB\nFile Type: ${req.file.mimetype}`;
    }

    try {
      fs.unlinkSync(filePath);
    } catch (unlinkErr) {
      // Ignore cleanup error
    }

    const promptText = `Please analyze and summarize this uploaded document "${req.file.originalname}" for the student. Highlight key concepts, formulas, and study points.`;
    const apiKey = process.env.GOOGLE_API_KEY;
    const isValidKey = apiKey && apiKey.trim() && !apiKey.includes('PLACEHOLDER');

    let reply = '';
    if (isValidKey) {
      try {
        const contents = [
          { role: 'user', parts: [{ text: PIYUSHDHARA_SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: "Understood! I am PiyushDhara AI." }] },
          { role: 'user', parts: [{ text: `[Document Extracted Content]:\n${extractedText}\n\n[User Request]:\n${promptText}` }] }
        ];
        reply = await callGeminiApi(apiKey, contents);
      } catch (e) {
        reply = generateLocalFallbackResponse(req.file.originalname, extractedText);
      }
    } else {
      reply = generateLocalFallbackResponse(req.file.originalname, extractedText);
    }

    return res.status(200).json({
      success: true,
      filename: req.file.originalname,
      extractedText,
      reply
    });

  } catch (error) {
    console.error('analyzeUploadedFile Error:', error);
    return res.status(500).json({ message: error.message || 'Error processing uploaded file' });
  }
};

module.exports = {
  chatWithAi,
  analyzeUploadedFile,
};
