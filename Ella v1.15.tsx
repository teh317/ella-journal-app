import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { PenTool, Calendar, Settings, Sun, Moon, X, Lock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

type Mood = 'Great' | 'Good' | 'OK/Meh' | 'Low' | 'Doomed';

const moodEmojis: Record<Mood, string> = {
  'Great': '😄',
  'Good': '🙂',
  'OK/Meh': '😐',
  'Low': '😔',
  'Doomed': '😞'
};

const moodGradients: Record<Mood, string> = {
  'Great': 'from-green-400 to-blue-500',
  'Good': 'from-yellow-400 to-orange-500',
  'OK/Meh': 'from-blue-400 to-purple-500',
  'Low': 'from-purple-400 to-pink-500',
  'Doomed': 'from-red-400 to-pink-500'
};

const moodPrompts: Record<Mood, string[]> = {
  'Great': [
    "What's been the highlight of your day so far?",
    "What are you most proud of achieving today?",
    "Who or what has made you feel especially grateful recently?",
    "Describe a moment today where you felt truly at peace or happy.",
    "What's something you're excited about that's coming up soon?",
    "What is bringing you joy today?",
    "Describe something that made you smile recently.",
    "What are you most grateful for at this moment?",
    "Reflect on a happy memory and describe it in detail.",
    "Ok, I'm listening..."
  ],
  'Good': [
    "What's a small thing today that made you smile?",
    "Is there something that went well today you'd like to remember?",
    "Who did you connect with today, and how did it make you feel?",
    "What's a simple pleasure you enjoyed recently?",
    "What's one thing you're looking forward to tomorrow?",
    "What moment today brought you joy or made you smile?",
    "Is there someone who contributed to your happiness today?",
    "What's one thing you feel grateful for at this moment?",
    "How can you carry this positive feeling into the rest of your day?",
    "What activity or experience would you like to revisit to feel this way again?",
    "Ok, I'm listening..."
  ],
  'OK/Meh': [
    "Is there anything on your mind that's been taking up space today?",
    "What's something that felt neutral but that you're glad got done?",
    "Is there a moment today that felt repetitive, and how did you manage it?",
    "What's one thing you did today just for yourself?",
    "What's something you wish had gone differently today?",
    "How would you describe your day so far?",
    "Is there anything you wish had gone differently today?",
    "What's one thing you're looking forward to?",
    "Write about something you noticed today but don't usually pay attention to.",
    "Ok, I'm listening..."
  ],
  'Low': [
    "What's been the hardest part of your day, and how did you cope with it?",
    "Is there something you're struggling with right now that you want to express?",
    "Who or what has helped you get through today, even if just a little?",
    "What's one thing you wish someone understood about how you're feeling?",
    "What's one small thing you did today, even if it was difficult?",
    "What is currently causing you to feel unsettled?",
    "Are there specific thoughts or worries on your mind today?",
    "How is your body reacting to your anxiety (e.g., tightness, restlessness)?",
    "Can you identify one small step you might take to feel calmer?",
    "What support or reassurance could you use right now?",
    "Ok, I'm listening..."
  ],
  'Doomed': [
    "What's making things feel overwhelming today?",
    "Is there a thought or feeling that's been hard to shake?",
    "What's something you need but feel you're lacking right now?",
    "What would you tell someone else going through what you are now?",
    "Is there one thing that you wish could change right now, no matter how big or small?",
    "What is the main source of stress in your life right now?",
    "How is stress affecting your mood or energy levels today?",
    "Is there anything you can do at this moment to relieve some of the pressure?",
    "What has helped you manage stress in the past?",
    "Can you list three things you can control and focus on today?",
    "Ok, I'm listening..."
  ]
};

type ChatMessage = {
  type: 'prompt' | 'response';
  content: string;
};

type JournalEntry = {
  id: string;
  mood: Mood;
  chat: ChatMessage[];
  date: string;
};

const ENCRYPTION_KEY = 'your-secret-key'; // Replace with a secure, randomly generated key

function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export default function EllaApp() {
  const [currentMood, setCurrentMood] = useState<Mood>('OK/Meh');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [calendarMode, setCalendarMode] = useState<'sidebar' | 'overlay'>('sidebar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('ellaEntries');
    if (storedEntries) {
      const decryptedEntries = JSON.parse(decryptData(storedEntries));
      setEntries(decryptedEntries);
    }
    const storedUserName = localStorage.getItem('ellaUserName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    const storedUserEmail = localStorage.getItem('ellaUserEmail');
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
    const storedTheme = localStorage.getItem('ellaTheme');
    if (storedTheme) {
      setTheme(storedTheme as 'light' | 'dark');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarMode('overlay');
        setShowCalendar(false);
      } else {
        setCalendarMode('sidebar');
        setShowCalendar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      chat: chatMessages,
      date: new Date().toISOString()
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    const encryptedEntries = encryptData(JSON.stringify(updatedEntries));
    localStorage.setItem('ellaEntries', encryptedEntries);
    setShowNewEntry(false);
    setChatMessages([]);
    setSelectedEntry(null);
  };

  const saveUserProfile = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('ellaUserName', name);
    localStorage.setItem('ellaUserEmail', email);
    setShowSettings(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ellaTheme', newTheme);
  };

  const startNewEntry = () => {
    setShowNewEntry(true);
    setSelectedEntry(null);
    const initialPrompt = moodPrompts[currentMood][Math.floor(Math.random() * moodPrompts[currentMood].length)];
    setChatMessages([{ type: 'prompt', content: initialPrompt }]);
  };

  const addUserResponse = (response: string) => {
    setChatMessages([...chatMessages, { type: 'response', content: response }]);
    if (chatMessages.length < 3) {
      const nextPrompt = "Ok, I'm listening...";
      setChatMessages(prev => [...prev, { type: 'prompt', content: nextPrompt }]);
    }
  };

  const viewSelectedEntry = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setSelectedEntry(entryId);
      setChatMessages(entry.chat);
      setCurrentMood(entry.mood);
      setShowNewEntry(true);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const deleteEntries = () => {
    setEntries([]);
    localStorage.removeItem('ellaEntries');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      <div className={`min-h-screen flex transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : `bg-gradient-to-br ${moodGradients[currentMood]}`
      }`}>
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ x: calendarMode === 'sidebar' ? -300 : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: calendarMode === 'sidebar' ? -300 : 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${
                calendarMode === 'sidebar'
                  ? 'w-80 md:relative'
                  : 'fixed inset-0 z-50 bg-black bg-opacity-50'
              }`}
            >
              <CalendarSidebar
                entries={entries}
                viewSelectedEntry={viewSelectedEntry}
                theme={theme}
                calendarMode={calendarMode}
                toggleCalendar={toggleCalendar}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col p-4">
          <header className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              <button
                onClick={toggleCalendar}
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {showCalendar ? <ChevronLeft className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
              </button>
            </div>
            <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'} font-['Afacad_Flux', sans-serif]`}>Ella</h1>
            <div className="w-24" /> {/* Placeholder for symmetry */}
          </header>
          <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-white'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>
              How are you feeling today, {' '}
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                theme === 'dark' ? 'from-purple-400 to-pink-600' : 'from-yellow-400 to-red-600'
              }`}>
                {userName || 'friend'}
              </span>
              ?
            </h2>
            <MoodSelector currentMood={currentMood} setCurrentMood={setCurrentMood} theme={theme} />
            <AdSpace theme={theme} />
            <div className="flex items-center justify-center mb-2">
              <Lock className="w-4 h-4 mr-1 text-white opacity-50" />
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-white'} opacity-50 font-['Montserrat', 'Outfit_Thin', sans-serif]`}>
                All entries are encrypted. Only you can read them.
              </p>
            </div>
            <AnimatePresence>
              {showNewEntry ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  <ChatInterface
                    chatMessages={chatMessages}
                    addUserResponse={addUserResponse}
                    addEntry={addEntry}
                    
                    cancelEntry={() => {
                      setShowNewEntry(false);
                      setChatMessages([]);
                      setSelectedEntry(null);
                    }}
                    theme={theme}
                    isViewingEntry={!!selectedEntry}
                  />
                </motion.div>
              ) : (
                <motion.button
                  className={`w-full py-4 rounded-lg font-semibold transition-all ${
                    theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                  onClick={startNewEntry}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  <PenTool className="inline-block mr-2" />
                  New Entry
                </motion.button>
              )}
            </AnimatePresence>
          </main>
        </div>
        {showSettings && (
          <SettingsModal
            userName={userName}
            userEmail={userEmail}
            saveUserProfile={saveUserProfile}
            closeModal={() => setShowSettings(false)}
            theme={theme}
            setTheme={setTheme}
            deleteEntries={deleteEntries}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

function MoodSelector({ currentMood, setCurrentMood, theme }: { currentMood: Mood; setCurrentMood: (mood: Mood) => void; theme: string }) {
  const moods: Mood[] = ['Great', 'Good', 'OK/Meh', 'Low', 'Doomed'];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => setCurrentMood(mood)}
          className={`p-4 rounded-full text-3xl transition-all ${
            theme === 'dark'
              ? `bg-gradient-to-br ${moodGradients[mood]} ${currentMood === mood ? 'scale-110' : ''}`
              : currentMood === mood
              ? 'bg-white bg-opacity-50 scale-110'
              : 'bg-white bg-opacity-20 hover:bg-opacity-30'
          }`}
        >
          {moodEmojis[mood]}
        </button>
      ))}
    </div>
  );
}

function ChatInterface({ chatMessages, addUserResponse, addEntry, cancelEntry, theme, isViewingEntry }: {
  chatMessages: ChatMessage[];
  addUserResponse: (response: string) => void;
  addEntry: () => void;
  cancelEntry: () => void;
  theme: string;
  isViewingEntry: boolean;
}) {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      addUserResponse(userInput);
      setUserInput('');
    }
  };

  return (
    <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white bg-opacity-20'}`}>
      <div className="h-64 overflow-y-auto mb-4">
        {chatMessages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.type === 'prompt' ? 'text-left' : 'text-right'}`}>
            <span className={`inline-block p-2 rounded-lg ${
              message.type === 'prompt'
                ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-50 text-gray-800'
                : theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      {!isViewingEntry && (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={`flex-1 p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-50 text-gray-800'
            }`}
            placeholder="Type your response..."
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            Send
          </button>
        </form>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={cancelEntry}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {isViewingEntry ? 'Close' : 'Cancel'}
        </button>
        {!isViewingEntry && (
          <button
            onClick={addEntry}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            }`}
          >
            Finish Entry
          </button>
        )}
      </div>
    </div>
  );
}

function CalendarSidebar({ entries, viewSelectedEntry, theme, calendarMode, toggleCalendar }: {
  entries: JournalEntry[];
  viewSelectedEntry: (id: string) => void;
  theme: string;
  calendarMode: 'sidebar' | 'overlay';
  toggleCalendar: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`h-full p-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white bg-opacity-10'} ${
      calendarMode === 'overlay' ? 'w-full max-w-md mx-auto' : 'w-80'
    }`}>
      {calendarMode === 'overlay' && (
        <button
          onClick={toggleCalendar}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-50 text-gray-800'
          }`}
        >
          <X className="h-6 w-6" />
        </button>
      )}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-white">&lt;</button>
        <h2 className="text-white font-bold font-['Montserrat', 'Outfit_Thin', sans-serif]">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="text-white">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-white text-opacity-60 font-['Montserrat', 'Outfit_Thin', sans-serif]">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
          const entry = entries.find(e => e.date.startsWith(date));
          return (
            <button
              key={day}
              className={`aspect-square flex items-center justify-center rounded-full ${
                entry
                  ? `bg-gradient-to-br ${moodGradients[entry.mood]}`
                  : theme === 'dark'
                  ? 'text-gray-500'
                  : 'text-white text-opacity-60'
              } font-['Montserrat', 'Outfit_Thin', sans-serif]`}
              onClick={() => entry && viewSelectedEntry(entry.id)}
            >
              {entry ? moodEmojis[entry.mood] : day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold text-white font-['Montserrat', 'Outfit_Thin', sans-serif]">Recent Entries</h3>
        
        {entries.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white bg-opacity-20'}`}
            onClick={() => viewSelectedEntry(entry.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{moodEmojis[entry.mood]}</span>
              <span className="text-sm text-white text-opacity-60 font-['Montserrat', 'Outfit_Thin', sans-serif]">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white text-sm mt-1 truncate font-['Montserrat', 'Outfit_Thin', sans-serif]">
              {entry.chat[entry.chat.length - 1].content}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-white text-sm font-['Montserrat', 'Outfit_Thin', sans-serif]">
        <p>Today is {formattedDate}</p>
        <p>Current time: {formattedTime}</p>
      </div>
    </div>
  );
}

function AdSpace({ theme }: { theme: string }) {
  return (
    <div className={`my-4 p-4 rounded-lg relative ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white bg-opacity-20 backdrop-blur-lg'
    }`}>
      <span className="absolute top-1 left-1 text-xs opacity-50 font-['Montserrat', 'Outfit_Thin', sans-serif]">Ad</span>
      <div className="h-20 flex items-center justify-center text-white text-opacity-50 font-['Montserrat', 'Outfit_Thin', sans-serif]">
        Advertisement Space
      </div>
    </div>
  );
}

function SettingsModal({ userName, userEmail, saveUserProfile, closeModal, theme, setTheme, deleteEntries }: {
  userName: string;
  userEmail: string;
  saveUserProfile: (name: string, email: string) => void;
  closeModal: () => void;
  theme: string;
  setTheme: (theme: 'light' | 'dark') => void;
  deleteEntries: () => void;
}) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(name, email);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('ellaTheme', newTheme);
  };

  const handleDeleteEntries = () => {
    deleteEntries();
    setShowDeleteConfirmation(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
            />
          </div>
          <div>
            <label htmlFor="email" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
            />
          </div>
          <div>
            <label className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Theme</label>
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
              className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
            >
              Save
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Danger Zone</h3>
          {showDeleteConfirmation ? (
            <div className="space-y-2">
              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}>Are you sure you want to delete all entries? This action cannot be undone.</p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDeleteEntries}
                  className="px-4 py-2 rounded bg-red-600 text-white font-['Montserrat', 'Outfit_Thin', sans-serif]"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} font-['Montserrat', 'Outfit_Thin', sans-serif]`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center px-4 py-2 rounded bg-red-600 text-white font-['Montserrat', 'Outfit_Thin', sans-serif]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Entries
            </button>
          )}
        </div>
      </div>
    </div>
  );
}