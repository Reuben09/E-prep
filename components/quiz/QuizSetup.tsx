import React, { useState, useEffect } from 'react';
import { QuizMode, Topic, QuizSettings } from '../../types';
import { fetchTopics, fetchQuizData } from '../../services/apiService'; // Assuming this fetches general topics
import Card from '../ui/Card';
import Button from '../ui/Button';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../Sidebar';
import { FadeInFromBottom } from '../FadeInFromBottom';

interface QuizSetupProps {
  onStartQuiz: (settings: QuizSettings) => void;
}


const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [mode, setMode] = useState<QuizMode>(QuizMode.PAST_QUESTIONS);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [quizzData, setQuizData] = useState<[]>([]);
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
   const [availableSubjects, setAvailableSubjects] = useState<number[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]); // Changed to number[] to match quizData

  const uniqueExamTypes = [
  ...new Set(quizzData?.flatMap((item) => item.examType) || [])
];

useEffect(()=> {
    fetchQuizData(setQuizData);
},[])

useEffect(() => {
    if (!quizzData) return;

    const filteredItems = quizzData.filter(item => 
        item.examType === selectedExamType
    );

    const subjectsForExam = filteredItems.map(item => item.subject);
    setAvailableSubjects(subjectsForExam);
    let activeSubject = selectedSubject;

    if (selectedSubject && !subjectsForExam.includes(selectedSubject)) {
        setSelectedSubject('');
        setSelectedYear('');
        setAvailableYears([]);
        activeSubject = '';
    }

    if (activeSubject && selectedExamType) {
        const subjectDetails = filteredItems.find(item => 
            item.subject === activeSubject
        );

        if (subjectDetails) {
            setAvailableYears(subjectDetails.years);
            if (selectedYear && !subjectDetails.years.includes(parseInt(selectedYear))) {
                setSelectedYear('');
            }
        }
    } else {
        setAvailableYears([]);
    }

}, [selectedExamType, selectedSubject, quizzData]);

  const handleExamTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamType(e.target.value);
    setSelectedSubject('');
    setSelectedYear('');
  };

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
      } finally {
        setIsLoading(false);
      }
    };
    loadTopics();
  }, [selectedTopic]);

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setUploadedFileName(file.name);
    setPdfContentId(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const uploadResponse = await fetch('https://e-prep-server.onrender.com/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'PDF upload failed');
      }

      const uploadData = await uploadResponse.json(); 
      const contentId = uploadData.contentId;
      setPdfContentId(contentId);

      alert('PDF uploaded successfully! Fetching extracted text...');

      const textResponse = await fetch(`https://e-prep-server.onrender.com/api/get-pdf-content/${contentId}`);

      if (!textResponse.ok) {
        const errorData = await textResponse.json();
        throw new Error(errorData.message || 'Failed to retrieve extracted text');
      }

      const textData = await textResponse.json(); 
      console.log('Extracted text:', textData.pdfText);

      setExtractedPdfText(textData.pdfText); 
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
 
      onStartQuiz({ id: quizId, mode, numQuestions, pdfContentId, pdfExtractedText });
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

  const images = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=' '>
      <Sidebar screen={"quiz"} />
      <div className=' min-h-[100vh] w-[100vw] flex flex-col-reverse lg:flex-row items-center justify-between max-sm:pt-[100px] px-[2.5%]'>
        <div className=' w-[100%] lg:w-[70%] flex flex-row items-end justify-end'>
          <div className=' lg:w-[60%]'>
            <FadeInFromBottom>
              <Card className="w-full h-fit my-auto max-w-2xl mx-auto p-6 md:p-8 bg-white">
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
                        <label onClick={()=> console.log(quizzData)} htmlFor="examType" className="block text-lg font-semibold mb-3 text-black">2. Choose an Exam Type</label>
                         <select
        id="examType"
        value={selectedExamType}
        onChange={handleExamTypeChange}
        className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
      >
        <option value="" disabled>Select Exam Type</option>
        
        {uniqueExamTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-lg font-semibold mb-3 text-black">3. Choose a Subject</label>
                        <select     
                   className="w-full p-3 bg-transparent text-[#0099FF] border border-[#0099FF] rounded-lg focus:ring-2 focus:ring-[#0099FF] focus:border-none outline-none"
  value={selectedSubject} 
  onChange={(e) => setSelectedSubject(e.target.value)}
  disabled={!selectedExamType} // Disable if no exam type is selected
>
  <option value="">Select Subject</option>
  
  {availableSubjects.map((subjectName) => (
    <option key={subjectName} value={subjectName}>
      {subjectName}
    </option>
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
                      min="1"
                      max="20"
                      step="1"
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
            </FadeInFromBottom>
          </div>
        </div>

        <div className=' w-[95%] lg:w-[20%] h-[30vh] lg:h-[80vh] bg-red-500 max-sm:mb-[20px]' style={{ backgroundImage: `url(${images[index]})` }}></div>
      </div>
    </div>
  );
};

export default QuizSetup;