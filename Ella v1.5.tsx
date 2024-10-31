import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PenTool, Calendar, Settings, Sun, Moon, X, Lock, ChevronLeft, ChevronRight, Trash2, Info, LogIn, LogOut, UserPlus, Archive, Mail } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Import the Abril Fatface font
import { Abril_Fatface } from 'next/font/google';

const abrilFatface = Abril_Fatface({
  weight: '400',
  subsets: ['latin'],
});

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

type User = {
  name: string;
  email: string;
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
  const [showAccountNotification, setShowAccountNotification] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    const hasSeenNotification = localStorage.getItem('ellaAccountNotification');
    if (!hasSeenNotification) {
      setShowAccountNotification(true);
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

  const addEntry = (finalChatMessages: ChatMessage[]) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      chat: finalChatMessages,
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

  const startNewEntry = useCallback(() => {
    setShowNewEntry(true);
    setSelectedEntry(null);
    const initialPrompt = getSuggestedPrompt();
    setChatMessages([{ type: 'prompt', content: initialPrompt }]);
  }, [entries]);

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

  const getSuggestedPrompt = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const lastWeekEntry = entries.find(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getDay() === dayOfWeek && entryDate < today && today.getTime() - entryDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
    });

    if (lastWeekEntry) {
      if (lastWeekEntry.mood === currentMood) {
        return `Last ${getDayName(dayOfWeek)}, you were feeling ${currentMood.toLowerCase()} as well. Would you like to reflect on what's consistent in your life?`;
      } else {
        return `Last ${getDayName(dayOfWeek)}, you were feeling ${lastWeekEntry.mood.toLowerCase()}. How does that compare to your ${currentMood.toLowerCase()} mood today?`;
      }
    }

    const recentMoods = entries.slice(0, 5).map(entry => entry.mood);
    const moodCounts = recentMoods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Mood;

    if (mostFrequentMood && mostFrequentMood !== currentMood) {
      return `I've noticed you've been feeling ${mostFrequentMood.toLowerCase()} lately, but today you're ${currentMood.toLowerCase()}. What's changed?`;
    }

    const promptsForMood = moodPrompts[currentMood];
    const recentPrompts = entries.slice(0, 3).flatMap(entry => entry.chat.filter(msg => msg.type === 'prompt').map(msg => msg.content));
    const unusedPrompts = promptsForMood.filter(prompt => !recentPrompts.includes(prompt));

    if (unusedPrompts.length > 0) {
      return unusedPrompts[Math.floor(Math.random() * unusedPrompts.length)];
    }

    return promptsForMood[Math.floor(Math.random() * promptsForMood.length)];
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const closeAccountNotification = () => {
    setShowAccountNotification(false);
    localStorage.setItem('ellaAccountNotification', 'true');
  };

  const login = (email: string, password: string): boolean => {
    // Replace with your actual login logic
    console.log('Logging in with:', email, password);
    setUser({ name: userName, email });
    return true;
  };

  const logout = () => {
    setUser(null);
    setUserName('');
    setUserEmail('');
  };

  const register = (name: string, email: string, password: string) => {
    // Replace with your actual registration logic
    console.log('Registering user:', name, email, password);
    setUser({ name, email });
    setUserName(name);
    setUserEmail(email);
  };

  const archiveEntries = () => {
    // Replace with your actual archive logic
    console.log('Archiving entries');
  };

  const sendArchivedEntriesToEmail = () => {
    // Replace with your actual email sending logic
    console.log('Sending archived entries to email');
  };

  return (
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
            exit={{ x: calendarMode === 'sidebar' ? -300  : 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${
              calendarMode === 'sidebar'
                ? 'w-80 md:relative'
                : 'fixed  inset-0 z-50 bg-black bg-opacity-50'
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
      <div className="flex-1 flex flex-col p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCalendar}
              className={`p-2 rounded-full transition-all ${
                theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {showCalendar ? <ChevronLeft className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full transition-all ${
                theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <Settings className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all ${
                theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </motion.button>
          </div>
          <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'} ${abrilFatface.className}`}>ella</h1>
          <div className="w-24" /> {/* Placeholder for symmetry */}
        </header>
        <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-white'} font-['Montserrat', 'Outfit', sans-serif]`}>
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
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-white'} opacity-50 font-['Open Sans', sans-serif]`}>
              All entries are encrypted. Only you can read them.
            </p>
          </div>
          <AnimatePresence mode="wait">
            {showNewEntry ? (
              <motion.div
                key="chat-interface"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ChatInterface
                  chatMessages={chatMessages}
                  addUserResponse={addUserResponse}
                  addEntry={(finalMessages) => addEntry(finalMessages)}
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
                key="new-entry-button"
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
                onClick={startNewEntry}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PenTool className="inline-block mr-2" />
                New Entry
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center mt-2">
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-white'} opacity-50 font-['Open Sans', sans-serif]`}>
              made with ❤️ by Tehillah Kachila
            </p>
          </div>
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
          user={user}
          login={login}
          logout={logout}
          register={register}
          archiveEntries={archiveEntries}
          sendArchivedEntriesToEmail={sendArchivedEntriesToEmail}
        />
      )}
      {showAccountNotification && (
        <AccountNotification onClose={closeAccountNotification} theme={theme} />
      )}
    </div>
  );
}

function MoodSelector({ currentMood, setCurrentMood, theme }: { currentMood: Mood; setCurrentMood: (mood: Mood) => void; theme: string }) {
  const moods: Mood[] = ['Great', 'Good', 'OK/Meh', 'Low', 'Doomed'];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {moods.map((mood) => (
        <motion.button
          key={mood}
          onClick={() => setCurrentMood(mood)}
          className={`p-4 rounded-full text-3xl transition-all ${
            theme === 'dark'
              ? `bg-gradient-to-br ${moodGradients[mood]} ${currentMood === mood ? 'scale-110' : ''}`
              : currentMood === mood
              ? 'bg-white bg-opacity-50 scale-110'
              : 'bg-white bg-opacity-20 hover:bg-opacity-30'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {moodEmojis[mood]}
        </motion.button>
      ))}
    </div>
  );
}

function ChatInterface({ chatMessages, addUserResponse, addEntry, cancelEntry, theme, isViewingEntry }: {
  chatMessages: ChatMessage[];
  addUserResponse: (response: string) => void;
  addEntry: (finalMessages: ChatMessage[]) => void;
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

  const handleFinishEntry = () => {
    const reassuringMessage = "Thank you for sharing with me today. Please take care of yourself.";
    addUserResponse(reassuringMessage);
    setTimeout(() => {
      addEntry([...chatMessages, { type: 'prompt', content: reassuringMessage }]);
    }, 1000);
  };

  return (
    <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white bg-opacity-20'}`}>
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {chatMessages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 ${message.type === 'prompt' ? 'text-left' : 'text-right'}`}
          >
            <span className={`inline-block p-2 rounded-lg ${
              message.type === 'prompt'
                ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white bg-opacity-50 text-gray-800'
                : theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            } font-['Open Sans', sans-serif]`}>
              {message.content}
            </span>
          </motion.div>
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
            } font-['Open Sans', sans-serif]`}
            placeholder="Type your response..."
          />
          <motion.button
            type="submit"
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            } font-['Open Sans', sans-serif]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </form>
      )}
      <div className="flex justify-between mt-4">
        <motion.button
          onClick={cancelEntry}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
          } font-['Open Sans', sans-serif]`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isViewingEntry ? 'Close' : 'Cancel'}
        </motion.button>
        {!isViewingEntry && (
          <motion.button
            onClick={handleFinishEntry}
            className={`px-4 py-2 rounded-lg ${
              theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            } font-['Open Sans', sans-serif]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Finish Entry
          </motion.button>
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
    <div className={`h-full p-4 overflow-y-auto transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800' 
        : calendarMode === 'overlay' 
          ? 'bg-white bg-opacity-90 text-gray-800' 
          : 'bg-white bg-opacity-10'
    } ${
      calendarMode === 'overlay' 
        ? 'fixed inset-0 z-50 w-full max-w-none' 
        : 'w-80'
    }`}>
      {calendarMode === 'overlay' && (
        <motion.button
          onClick={toggleCalendar}
          className={`fixed top-4 right-4 p-2 rounded-full z-50 ${
            theme === 'dark' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>
      )}
      <div className="flex justify-between items-center mb-4">
        <motion.button onClick={prevMonth} className="text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>&lt;</motion.button>
        <h2 className={`font-bold font-['Roboto Slab',  serif] ${
          theme === 'dark' || calendarMode !== 'overlay' 
            ? 'text-white' 
            : 'text-gray-800'
        }`}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <motion.button onClick={nextMonth} className="text-white"  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>&gt;</motion.button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className={`text-center text-opacity-60 font-['Open Sans', sans-serif] ${
            theme === 'dark' || calendarMode !== 'overlay' ? 'text-white' : 'text-gray-800'
          }`}>{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
          const entry = entries.find(e => e.date.startsWith(date));
          return (
            <motion.button
              key={day}
              className={`aspect-square flex items-center justify-center rounded-full ${
                entry
                  ? `bg-gradient-to-br ${moodGradients[entry.mood]}`
                  : theme === 'dark' || calendarMode !== 'overlay'
                  ? 'text-gray-500'
                  : 'text-gray-400'
              } font-['Open Sans', sans-serif]`}
              onClick={() => entry && viewSelectedEntry(entry.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {entry ? moodEmojis[entry.mood] : day}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 space-y-4">
        <h3 className={`text-lg font-semibold font-['Roboto Slab', serif] ${
          theme === 'dark' || calendarMode !== 'overlay' ? 'text-white' : 'text-gray-800'
        }`}>Recent Entries</h3>
        {entries.slice(0, 5).map((entry) => (
          <motion.div
            key={entry.id}
            className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-700' 
                : calendarMode === 'overlay' 
                  ? 'bg-gray-200' 
                  : 'bg-white bg-opacity-20'
            }`}
            onClick={() => viewSelectedEntry(entry.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{moodEmojis[entry.mood]}</span>
              <span className={`text-sm text-opacity-60 font-['Open Sans', sans-serif] ${
                theme === 'dark' || calendarMode !== 'overlay' ? 'text-white' : 'text-gray-800'
              }`}>
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className={`text-sm mt-1 truncate font-['Open Sans', sans-serif] ${
              theme === 'dark' || calendarMode !== 'overlay' ? 'text-white' : 'text-gray-800'
            }`}>
              {entry.chat[entry.chat.length - 1].content}
            </p>
          </motion.div>
        ))}
      </div>
      <div className={`mt-4 text-sm font-['Open Sans', sans-serif] ${
        theme === 'dark' || calendarMode !== 'overlay' ? 'text-white' : 'text-gray-800'
      }`}>
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
      <span className="absolute top-1 left-1 text-xs opacity-50 font-['Open Sans', sans-serif]">Ad</span>
      <div className="h-20 flex items-center justify-center text-white text-opacity-50 font-['Open Sans', sans-serif]">
        Advertisement Space
      </div>
    </div>
  );
}

function SettingsModal({ userName, userEmail, saveUserProfile, closeModal, theme, setTheme, deleteEntries, user, login, logout, register, archiveEntries, sendArchivedEntriesToEmail }: {
  userName: string;
  userEmail: string;
  saveUserProfile: (name: string, email: string) => void;
  closeModal: () => void;
  theme: string;
  setTheme: (theme: 'light' | 'dark') => void;
  deleteEntries: () => void;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  archiveEntries: () => void;
  sendArchivedEntriesToEmail: () => void;
}) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAccountSection, setShowAccountSection] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(name, email);
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleDeleteEntries = () => {
    deleteEntries();
    setShowDeleteConfirmation(false);
    closeModal();
  };

  const handleLogin = () => {
    if (login(email, password)) {
      setLoginError('');
      setShowAccountSection(false);
    } else {
      setLoginError('Incorrect email or password');
    }
  };

  const handleRegister = () => {
    if (password === confirmPassword) {
      register(name, email, password);
      setShowAccountSection(false);
    } else {
      setRegisterError('Passwords do not match');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={closeModal}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Roboto Slab', serif]`}>Settings</h2>
        
        <div className="flex mb-4 space-x-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-full ${
              activeTab === 'general'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            } font-['Open Sans', sans-serif]`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-full ${
              activeTab === 'account'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            } font-['Open Sans', sans-serif]`}
          >
            Account
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Open Sans', sans-serif]`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Open Sans', sans-serif]`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Theme</span>
                  <button
                    type="button"
                    onClick={handleThemeChange}
                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                  >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-8 mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Roboto Slab', serif]`}>About Ella</h3>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>
                    Ella is a no-frills journaling companion designed to help you reflect on your emotions and experiences. Created with care by Tehillah Kachila.
                  </p>
                </div>
                <div className="mt-8">
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Roboto Slab', serif]`}>Danger Zone</h3>
                  {showDeleteConfirmation ? (
                    <div className="space-y-2">
                      <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Are you sure you want to delete all entries? This action cannot be undone.</p>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleDeleteEntries}
                          className="px-4 py-2 rounded-full bg-red-600 text-white font-['Open Sans', sans-serif]"
                        >
                          Yes, Delete All
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirmation(false)}
                          className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} font-['Open Sans', sans-serif]`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmation(true)}
                      className="flex items-center px-4 py-2 rounded-full bg-red-600 text-white font-['Open Sans', sans-serif]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Entries
                    </button>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} font-['Open Sans', sans-serif]`}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {!user ? (
                <>
                  <div>
                    <label htmlFor="password" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Open Sans', sans-serif]`}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={`block mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} font-['Open Sans', sans-serif]`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleLogin}
                      className={`flex-1 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} font-['Open Sans', sans-serif]`}
                    >
                      <LogIn className="w-4 h-4 inline mr-2" />
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={handleRegister}
                      className={`flex-1 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white'} font-['Open Sans', sans-serif]`}
                    >
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Register
                    </button>
                  </div>
                  {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                  {registerError && <p className="text-red-500 text-xs">{registerError}</p>}
                </>
              ) : (
                <>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>Logged in as {user.email}</p>
                  <button
                    onClick={logout}
                    className={`w-full px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} font-['Open Sans', sans-serif]`}
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                  <button
                    onClick={archiveEntries}
                    className={`w-full px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'} font-['Open Sans', sans-serif]`}
                  >
                    <Archive className="w-4 h-4 inline mr-2" />
                    Archive Entries
                  </button>
                  <button
                    onClick={sendArchivedEntriesToEmail}
                    className={`w-full px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'} font-['Open Sans', sans-serif]`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Send Archived Entries to Email
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function AccountNotification({ onClose, theme }: { onClose: () => void; theme: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}
      >
        <div className="flex items-center mb-4">
          <Info className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Roboto Slab', serif]`}>Welcome to Ella!</h2>
        </div>
        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} font-['Open Sans', sans-serif]`}>
          You can enhance your journaling experience by creating an account, but it's completely optional. All features are available without an account.
        </p>
        <div className="flex justify-end mt-4">
          <motion.button 
            onClick={onClose} 
            className={`px-4 py-2 rounded-full ${
              theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            } font-['Open Sans', sans-serif]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Got it
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}