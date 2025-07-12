const questionBank: Record<string, Record<string, string[]>> = {
  "react developer": {
    easy: [
      "What is JSX in React?",
      "How do you create a component?",
    ],
    medium: [
      "Explain useEffect and how dependency array works.",
      "What is virtual DOM?",
    ],
    hard: [
      "What are React hooks rules and how to enforce them?",
      "Explain React Fiber architecture.",
    ],
    expert: [
      "How would you optimize rendering in a large React app?",
      "How does React reconcile updates during concurrent mode?",
    ],
  },
  "data analyst": {
    easy: ["What is a CSV file?", "What is data cleaning?"],
    expert: ["How do you handle outliers in multivariate datasets?", "Explain PCA and when you would use it."],
  },
 "javascript developer": {
  easy: [
    "What is a variable in JavaScript?",
    "Explain let vs var vs const.",
  ],
  medium: [
    "What is event delegation in JavaScript?",
    "Explain closures with an example.",
  ],
  hard: [
    "What are Promises and how are they different from callbacks?",
    "Explain the Event Loop in JavaScript.",
  ],
  expert: [
    "How does garbage collection work in V8?",
    "What is memory leak and how to detect it in JS?",
  ],
},
"java developer": {
  easy: [
    "What is a class in Java?",
    "What is the difference between JDK and JVM?",
  ],
  medium: [
    "Explain the concept of inheritance in Java.",
    "What are access modifiers?",
  ],
  hard: [
    "What is multithreading in Java?",
    "Explain the difference between HashMap and ConcurrentHashMap.",
  ],
  expert: [
    "Explain the internals of JVM garbage collection.",
    "What is the difference between volatile and synchronized?",
  ],
},

};

export const getNextQuestion = (
  field: string,
  level: string,
  step: number
): string | null => {
  const normalizedField = field.toLowerCase();
  const normalizedLevel = level.toLowerCase();
  const fallbackLevel = "easy";

  const questions = questionBank[normalizedField]?.[normalizedLevel]
    || questionBank[normalizedField]?.[fallbackLevel];

  return questions?.[step] || null;
};
