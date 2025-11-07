// import React, { useState, useEffect } from 'react';
// import { QuizMode, Topic, QuizSettings } from '../../types';
// import { fetchTopics } from '../../services/apiService'; // Assuming this fetches general topics
// import Card from '../ui/Card';
// import Button from '../ui/Button';
// import BrainCircuitIcon from '../icons/BrainCircuitIcon';
// import BookOpenIcon from '../icons/BookOpenIcon';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { v4 as uuidv4 } from 'uuid';

// interface QuizSetupProps {
//   onStartQuiz: (settings: QuizSettings) => void;
// }


// const quizData = {
//   "examTypes": ["WAEC", "NECO", "utme", "post-utme-aaua", "model"],
//   "subjects": {
//     "English language": [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010],
//     "Mathematics": [2006, 2007, 2008, 2009, 2013],
//     "Commerce": [1900, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2016],
//     "Accounting": [1997, 2004, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
//     "Biology": [2003, 2004, 2005, 2006, 2008, 2009, 2010, 2011, 2012],
//     "Physics": [2006, 2007, 2009, 2010, 2011, 2012],
//     "Chemistry": [2001, 2002, 2003, 2004, 2005, 2006, 2010],
//     "English literature": [2006, 2007, 2008, 2009, 2010, 2012, 2013, 2015],
//     "Government": [1999, 2006, 2007, 2008, 2009, 2000, 2010, 2011, 2012, 2013, 2016],
//     "Christian Religious Knowledge": [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2015],
//     "Geography": [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
//     "Economics": [2001, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
//     "Islamic Religious Knowledge": [2012],
//     "Civic Education": [2011, 2012, 2013, 2014, 2015, 2016],
//     "Insurance": [1, 2, 3, 4, 5, 2014, 2015],
//     "Current Affairs": [2013]
//   },
//   "years": ["2023", "2022", "2021", "2020", "2019"] // This list of years will likely be replaced by subject-specific years
// };

// const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
//   const [mode, setMode] = useState<QuizMode>(QuizMode.PAST_QUESTIONS);
//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [selectedTopic, setSelectedTopic] = useState<string>('');
//   const [numQuestions, setNumQuestions] = useState<number>(10); // Default to 10 questions
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
//   const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
//   const [pdfContentId, setPdfContentId] = useState<string | null>(null); // To store identifier for PDF content
//   const quizId = uuidv4();

//   // const [selectedExamType, setSelectedExamType] = useState<string>('');
//   // const [selectedSubject, setSelectedSubject] = useState<string>('');
//   // const [selectedYear, setSelectedYear] = useState<string>('');

//   const examTypes = ['WAEC', 'NECO', 'utme'];
//   const subjects = ['math', 'Physics', 'Chemistry', 'Biology', 'History'];
//   const years = ['2023', '2022', '2021', '2020', '2019'];

//     const [selectedExamType, setSelectedExamType] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');
//   const [availableYears, setAvailableYears] = useState([]);

//   // Populate available years when a subject is selected
//   useEffect(() => {
//     if (selectedSubject && quizData.subjects[selectedSubject]) {
//       setAvailableYears(quizData.subjects[selectedSubject]);
//       // Reset selected year if the previously selected year isn't available for the new subject
//       if (!quizData.subjects[selectedSubject].includes(parseInt(selectedYear))) {
//         setSelectedYear('');
//       }
//     } else {
//       setAvailableYears([]);
//       setSelectedYear('');
//     }
//   }, [selectedSubject, selectedYear]); // Include selectedYear in dependency array to re-evaluate when it changes

//   // Function to handle exam type change
//   const handleExamTypeChange = (e) => {
//     setSelectedExamType(e.target.value);
//     // Optionally reset subject and year when exam type changes if they are dependent
//     setSelectedSubject('');
//     setSelectedYear('');
//   };

//   // Function to handle subject change
//   const handleSubjectChange = (e) => {
//     setSelectedSubject(e.target.value);
//     setSelectedYear(''); // Reset year when subject changes
//   };

//   // Function to handle year change
//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//   };

//   useEffect(() => {
//     const loadTopics = async () => {
//       setIsLoading(true);
//       const fetchedTopics = await fetchTopics();
//       setTopics(fetchedTopics);
//       if (fetchedTopics.length > 0) {
//         setSelectedTopic(fetchedTopics[0].id);
//       }
//       setIsLoading(false);
//     };
//     loadTopics();
//   }, []);

//   const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsUploadingPdf(true);
//     setUploadedFileName(file.name);

//     // In a real application, you would send this file to your backend
//     // The backend would then process the PDF, extract text, and
//     // store it, returning an ID that you can use to reference it later
//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       // Example API call (you'll need to implement this on your backend)
//       const response = await fetch('/api/upload-pdf', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('PDF upload failed');
//       }

//       const data = await response.json();
//       setPdfContentId(data.contentId); // Assume backend returns a contentId
//       alert('PDF uploaded successfully! Now generating questions...');

//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//       setUploadedFileName(null);
//       setPdfContentId(null);
//       alert('Failed to upload PDF. Please try again.');
//     } finally {
//       setIsUploadingPdf(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (mode === QuizMode.PAST_QUESTIONS) {
//       if (!selectedExamType || !selectedSubject || !selectedYear || !numQuestions) {
//         alert('Please select an exam type, subject, year, and number of questions.');
//         return;
//       }
//       onStartQuiz({ id: quizId, selectedExamType, selectedSubject, selectedYear, mode, numQuestions });
//     } else if (mode === QuizMode.AI_GENERATED) {
//       if (!selectedTopic || !numQuestions) {
//         alert('Please select a topic and number of questions.');
//         return;
//       }
//       const topic = topics.find(t => t.id === selectedTopic);
//       if (topic) {
//         onStartQuiz({ id: quizId, mode, topic, numQuestions });
//       }
//     } else if (mode === QuizMode.PDF_UPLOAD) {
//       if (!pdfContentId || !numQuestions) {
//         alert('Please upload a PDF and select the number of questions.');
//         return;
//       }
//       // When starting the quiz for PDF_UPLOAD, pass the pdfContentId
//       onStartQuiz({ id: quizId, mode, numQuestions, pdfContentId });
//     }
//   };

//   interface ModeButtonProps {
//     value: QuizMode;
//     children: React.ReactNode;
//   }
//   const ModeButton = ({ value, children }: ModeButtonProps) => (
//     <button
//       type="button"
//       onClick={() => {
//         setMode(value);
//         // Reset PDF state when switching modes
//         if (value !== QuizMode.PDF_UPLOAD) {
//           setUploadedFileName(null);
//           setPdfContentId(null);
//         }
//       }}
//       className={`flex-1 p-4 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 border-2 ${
//         mode === value
//           ? 'bg-[#0099FF]/20 border-[#0099FF]'
//           : 'bg-white border-[#0099FF] hover:bg-[#0099FF]/20'
//       }`}
//     >
//       {children}
//     </button>
//   );

//   return (
//     <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white">
//       <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-black bg-black">
//         Create a New Quiz
//       </h2>
//       <p className="text-center text-gray-400 mb-8">Choose your challenge and prove your knowledge.</p>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-lg font-semibold mb-3 text-black">1. Select Quiz Mode</label>
//           <div className="flex gap-4">
//             <ModeButton value={QuizMode.PAST_QUESTIONS}>
//               <BookOpenIcon className="w-8 h-8 text-[#0099FF]" />
//               <span className="font-semibold text-[#0099FF]">{QuizMode.PAST_QUESTIONS}</span>
//             </ModeButton>
//             <ModeButton value={QuizMode.AI_GENERATED}>
//               <BrainCircuitIcon className="w-8 h-8 text-[#0099FF]" />
//               <span className="font-semibold text-[#0099FF]">{QuizMode.AI_GENERATED}</span>
//             </ModeButton>
//             <ModeButton value={QuizMode.PDF_UPLOAD}>
//               <CloudUploadIcon className="w-8 h-8 text-[#0099FF]" />
//               <span className="font-semibold text-[#0099FF]">{QuizMode.PDF_UPLOAD}</span>
//             </ModeButton>
//           </div>
//         </div>

//           {mode === QuizMode.PAST_QUESTIONS && (
//         <div className="space-y-4">
//           <div>
//             <label htmlFor="examType" className="block text-lg font-semibold mb-3 text-black">2. Choose an Exam Type</label>
//             <select
//               id="examType"
//               value={selectedExamType}
//               onChange={handleExamTypeChange}
//               className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
//             >
//               <option value="" disabled>Select Exam Type</option>
//               {quizData.examTypes.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="subject" className="block text-lg font-semibold mb-3 text-black">3. Choose a Subject</label>
//             <select
//               id="subject"
//               value={selectedSubject}
//               onChange={handleSubjectChange}
//               className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
//             >
//               <option value="" disabled>Select Subject</option>
//               {Object.keys(quizData.subjects).map((subjectName) => (
//                 <option key={subjectName} value={subjectName}>{subjectName}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="year" className="block text-lg font-semibold mb-3 text-black">4. Choose a Year</label>
//             <select
//               id="year"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
//             >
//               <option value="" disabled>Select Year</option>
//               {availableYears.length > 0 ? (
//                 availableYears.map((year) => (
//                   <option key={year} value={year}>{year}</option>
//                 ))
//               ) : (
//                 <option value="" disabled>Select a subject first</option>
//               )}
//             </select>
//           </div>
//   </div>
// )}

//   {mode === QuizMode.AI_GENERATED && (
//           <div>
//             <label htmlFor="topic" className="block text-lg font-semibold mb-3 text-black">2. Choose a Subject</label>
//             {isLoading ? (
//               <div className="w-full h-12 bg-brand-surface rounded-lg animate-pulse"></div>
//             ) : (
//               <select
//                 id="topic"
//                 value={selectedTopic}
//                 onChange={(e) => setSelectedTopic(e.target.value)}
//                 className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
//               >
//                 {topics.map(topic => (
//                   <option key={topic.id} value={topic.id}>{topic.name}</option>
//                 ))}
//               </select>
//             )}
//           </div>
//         )}

//         {mode === QuizMode.PDF_UPLOAD && (
//           <div>
//             <label htmlFor="pdfUpload" className="block text-lg font-semibold mb-3 text-black">2. Upload your PDF</label>
//             <input
//               type="file"
//               id="pdfUpload"
//               accept=".pdf"
//               onChange={handlePdfUpload}
//               disabled={isUploadingPdf}
//               className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0099FF] file:text-white hover:file:bg-[#0099FF]/80"
//             />
//             {isUploadingPdf && <p className="mt-2 text-sm text-gray-500">Uploading "{uploadedFileName}"...</p>}
//             {!isUploadingPdf && uploadedFileName && pdfContentId && (
//               <p className="mt-2 text-sm text-green-600">Successfully uploaded: "{uploadedFileName}". Ready to generate questions!</p>
//             )}
//             {!isUploadingPdf && uploadedFileName && !pdfContentId && (
//               <p className="mt-2 text-sm text-red-600">Failed to process PDF: "{uploadedFileName}".</p>
//             )}
//           </div>
//         )}

//         <div>
//           {mode === QuizMode.AI_GENERATED &&<label htmlFor="numQuestions" className="block text-lg font-semibold mb-3 text-black">Number of Questions: <span className="text-[#0099FF] font-bold">{numQuestions}</span></label>}
//           <input
//             type="range"
//             id="numQuestions"
//             min="5"
//             max="20"
//             step="5"
//             value={numQuestions}
//             onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
//             className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-[#0099FF]"
//           />
//         </div>

//         <Button
//           type="submit"
//           className="w-full !py-4 text-lg"
//           disabled={isLoading || isUploadingPdf || (mode === QuizMode.PDF_UPLOAD && !pdfContentId)}
//         >
//           Start Quiz
//         </Button>
//       </form>
//     </Card>
//   );
// };

// export default QuizSetup;

import React, { useState, useEffect } from 'react';
import { QuizMode, Topic, QuizSettings } from '../../types';
import { fetchTopics } from '../../services/apiService'; // Assuming this fetches general topics
import Card from '../ui/Card';
import Button from '../ui/Button';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../Sidebar';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const quizData = {
  "examTypes": ["WAEC", "NECO", "utme", "post-utme-aaua", "model"],
  "subjects": {
    "English language": [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010],
    "Mathematics": [2006, 2007, 2008, 2009, 2013],
    "Commerce": [1900, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2016],
    "Accounting": [1997, 2004, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
    "Biology": [2003, 2004, 2005, 2006, 2008, 2009, 2010, 2011, 2012],
    "Physics": [2006, 2007, 2009, 2010, 2011, 2012],
    "Chemistry": [2001, 2002, 2003, 2004, 2005, 2006, 2010],
    "English literature": [2006, 2007, 2008, 2009, 2010, 2012, 2013, 2015],
    "Government": [1999, 2006, 2007, 2008, 2009, 2000, 2010, 2011, 2012, 2013, 2016],
    "Christian Religious Knowledge": [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2015],
    "Geography": [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
    "Economics": [2001, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
    "Islamic Religious Knowledge": [2012],
    "Civic Education": [2011, 2012, 2013, 2014, 2015, 2016],
    "Insurance": [1, 2, 3, 4, 5, 2014, 2015],
    "Current Affairs": [2013]
  },
  "years": ["2023", "2022", "2021", "2020", "2019"] // This list of years will likely be replaced by subject-specific years
};

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [mode, setMode] = useState<QuizMode>(QuizMode.PAST_QUESTIONS);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(10); // Default to 10 questions
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [pdfExtractedText, setExtractedPdfText] = useState<string>(''); // New state to hold extracted PDF text
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdfContentId, setPdfContentId] = useState<string | null>(null); // To store identifier for PDF content
  const quizId = uuidv4();

  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<number[]>([]); // Changed to number[] to match quizData

  // Populate available years when a subject is selected
  useEffect(() => {
    if (selectedSubject && quizData.subjects[selectedSubject]) {
      setAvailableYears(quizData.subjects[selectedSubject]);
      // Reset selected year if the previously selected year isn't available for the new subject
      if (!quizData.subjects[selectedSubject].includes(parseInt(selectedYear))) {
        setSelectedYear('');
      }
    } else {
      setAvailableYears([]);
      setSelectedYear('');
    }
  }, [selectedSubject, selectedYear]);

  // Function to handle exam type change
  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamType(e.target.value);
    // Optionally reset subject and year when exam type changes if they are dependent
    setSelectedSubject('');
    setSelectedYear('');
  };

  // Function to handle subject change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setSelectedYear(''); // Reset year when subject changes
  };

  // Function to handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    const loadTopics = async () => {
      setIsLoading(true);
      try {
        const fetchedTopics = await fetchTopics();
        setTopics(fetchedTopics);
        if (fetchedTopics.length > 0) {
          // Only set default if no topic is already selected
          if (!selectedTopic) {
            setSelectedTopic(fetchedTopics[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        // Optionally display an error message to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadTopics();
  }, [selectedTopic]); // Depend on selectedTopic to prevent re-fetching if it's already set

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setUploadedFileName(file.name);
    setPdfContentId(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      // 1️⃣ Upload PDF to backend
      const uploadResponse = await fetch('http://localhost:5000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'PDF upload failed');
      }

      const uploadData = await uploadResponse.json(); // { contentId, message }
      const contentId = uploadData.contentId;
      setPdfContentId(contentId);

      alert('PDF uploaded successfully! Fetching extracted text...');

      // 2️⃣ Fetch extracted text using the contentId
      const textResponse = await fetch(`http://localhost:5000/api/get-pdf-content/${contentId}`);

      if (!textResponse.ok) {
        const errorData = await textResponse.json();
        throw new Error(errorData.message || 'Failed to retrieve extracted text');
      }

      const textData = await textResponse.json(); // { contentId, pdfText }
      console.log('Extracted text:', textData.pdfText);

      // 3️⃣ Optionally store or display the extracted text
      setExtractedPdfText(textData.pdfText); // ← optional: you can store it in a new state variable

      alert('PDF text extracted successfully! You can now generate questions.');

    } catch (error: any) {
      console.error('Error uploading PDF:', error.message);
      setUploadedFileName(null);
      setPdfContentId(null);
      alert(`Failed to upload or process PDF: ${error.message}`);
    } finally {
      setIsUploadingPdf(false);
    }
  };


  // const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   setIsUploadingPdf(true);
  //   setUploadedFileName(file.name);
  //   setPdfContentId(null); // Clear previous PDF ID on new upload attempt

  //   try {
  //     const formData = new FormData();
  //     formData.append('pdf', file);

  //     // Example API call (you'll need to implement this on your backend)
  //     // This endpoint should take the PDF, extract text, and return a unique ID or the text itself.
  //     const response = await fetch('http://localhost:5000/api/upload-pdf', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'PDF upload failed');
  //     }

  //     const textResponse = await fetch(`http://localhost:5000/api/get-pdf-content/${contentId}`)
  //     const data = await response.json();
  //     // Assuming backend returns { contentId: "some-id" }
  //     // Or, if your backend directly returns the extracted text, you'd store that here.
  //     setPdfContentId(data.contentId);
  //     alert('PDF uploaded successfully! Now ready to generate questions.');

  //   } catch (error: any) {
  //     console.error('Error uploading PDF:', error.message);
  //     setUploadedFileName(null);
  //     setPdfContentId(null);
  //     alert(`Failed to upload PDF: ${error.message}. Please try again.`);
  //   } finally {
  //     setIsUploadingPdf(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === QuizMode.PAST_QUESTIONS) {
      if (!selectedExamType || !selectedSubject || !selectedYear || !numQuestions) {
        alert('Please select an exam type, subject, year, and number of questions.');
        return;
      }
      onStartQuiz({ id: quizId, selectedExamType, selectedSubject, selectedYear, mode, numQuestions });
    } else if (mode === QuizMode.AI_GENERATED) {
      if (!selectedTopic || !numQuestions) {
        alert('Please select a topic and number of questions.');
        return;
      }
      const topic = topics.find(t => t.id === selectedTopic);
      if (topic) {
        onStartQuiz({ id: quizId, mode, topic, numQuestions });
      }
    } else if (mode === QuizMode.PDF_UPLOAD) {
      if (!pdfContentId || !numQuestions) {
        alert('Please upload a PDF and select the number of questions.');
        return;
      }
      // When starting the quiz for PDF_UPLOAD, pass the pdfContentId
      onStartQuiz({ id: quizId, mode, numQuestions, pdfContentId });
    }
  };

  interface ModeButtonProps {
    value: QuizMode;
    icon: React.ReactNode;
    label: string;
  }
  const ModeButton: React.FC<ModeButtonProps> = ({ value, icon, label }) => (
    <button
      type="button"
      onClick={() => {
        setMode(value);
        // Reset PDF state when switching modes
        if (value !== QuizMode.PDF_UPLOAD) {
          setUploadedFileName(null);
          setPdfContentId(null);
        }
      }}
      className={`flex-1 p-4 rounded-lg transition-all duration-300 flex flex-col items-center gap-2 border-2 ${mode === value
          ? 'bg-[#0099FF]/20 border-[#0099FF]'
          : 'bg-white border-[#0099FF] hover:bg-[#0099FF]/20'
        }`}
    >
      {icon}
      <span className="font-semibold text-[#0099FF]">{label}</span>
    </button>
  );

  return (
    <div className=''>
      <Sidebar screen={"quiz"} />
      <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-black">
          Create a New Quiz
        </h2>
        <p className="text-center text-gray-400 mb-8">Choose your challenge and prove your knowledge.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-3 text-black">1. Select Quiz Mode</label>
            <div className="flex gap-4">
              <ModeButton value={QuizMode.PAST_QUESTIONS} icon={<BookOpenIcon className="w-8 h-8 text-[#0099FF]" />} label="Past Questions" />
              <ModeButton value={QuizMode.AI_GENERATED} icon={<BrainCircuitIcon className="w-8 h-8 text-[#0099FF]" />} label="AI Generated" />
              <ModeButton value={QuizMode.PDF_UPLOAD} icon={<CloudUploadIcon className="w-8 h-8 text-[#0099FF]" />} label="PDF Upload" />
            </div>
          </div>

          {mode === QuizMode.PAST_QUESTIONS && (
            <div className="space-y-4">
              <div>
                <label htmlFor="examType" className="block text-lg font-semibold mb-3 text-black">2. Choose an Exam Type</label>
                <select
                  id="examType"
                  value={selectedExamType}
                  onChange={handleExamTypeChange}
                  className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
                >
                  <option value="" disabled>Select Exam Type</option>
                  {quizData.examTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-lg font-semibold mb-3 text-black">3. Choose a Subject</label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
                >
                  <option value="" disabled>Select Subject</option>
                  {Object.keys(quizData.subjects).map((subjectName) => (
                    <option key={subjectName} value={subjectName}>{subjectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-lg font-semibold mb-3 text-black">4. Choose a Year</label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
                >
                  <option value="" disabled>Select Year</option>
                  {availableYears.length > 0 ? (
                    availableYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))
                  ) : (
                    <option value="" disabled>Select a subject first</option>
                  )}
                </select>
              </div>
            </div>
          )}

          {mode === QuizMode.AI_GENERATED && (
            <div>
              <label htmlFor="topic" className="block text-lg font-semibold mb-3 text-black">2. Choose a Subject/Topic</label>
              {isLoading ? (
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <select
                  id="topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
                >
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              )}
              {!isLoading && topics.length === 0 && (
                <p className="mt-2 text-sm text-red-600">No topics available. Please check your API connection.</p>
              )}
            </div>
          )}

          {mode === QuizMode.PDF_UPLOAD && (
            <div>
              <label htmlFor="pdfUpload" className="block text-lg font-semibold mb-3 text-black">2. Upload your PDF</label>
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={isUploadingPdf}
                className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0099FF] file:text-white hover:file:bg-[#0099FF]/80"
              />
              {isUploadingPdf && <p className="mt-2 text-sm text-gray-500">Uploading "{uploadedFileName}"...</p>}
              {!isUploadingPdf && uploadedFileName && pdfContentId && (
                <p className="mt-2 text-sm text-green-600">Successfully uploaded: "{uploadedFileName}". Ready to generate questions!</p>
              )}
              {!isUploadingPdf && uploadedFileName && !pdfContentId && (
                <p className="mt-2 text-sm text-red-600">Failed to process PDF: "{uploadedFileName}".</p>
              )}
            </div>
          )}

          {/* Number of Questions slider - now for all modes */}
          <div className={`${mode === QuizMode.PAST_QUESTIONS && "hidden"}`}>
            <label htmlFor="numQuestions" className="block text-lg font-semibold mb-3 text-black">Number of Questions: <span className="text-[#0099FF] font-bold">{numQuestions}</span></label>
            <input
              type="range"
              id="numQuestions"
              min="5"
              max="20"
              step="5"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-[#0099FF]"
            />
          </div>

          <Button
            type="submit"
            className="w-full !py-4 text-lg"
            disabled={
              isLoading ||
              isUploadingPdf ||
              (mode === QuizMode.PDF_UPLOAD && !pdfContentId) || // Must have PDF uploaded for PDF mode
              (mode === QuizMode.PAST_QUESTIONS && (!selectedExamType || !selectedSubject || !selectedYear)) || // Must have selections for Past Questions
              (mode === QuizMode.AI_GENERATED && !selectedTopic) // Must have a topic for AI Generated
            }
          >
            Start Quiz
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default QuizSetup;