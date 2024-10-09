import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { PenTool, Calendar, Settings, Sun, Moon } from 'lucide-react';

// Tehillah Kachila's Ella Journal App - Version 3.17
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

// Tehillah Kachila's main app component - 317 lines of joy
export default function EllaApp() {
  const [currentMood, setCurrentMood] = useState<Mood>('OK/Meh');
  const [entries, setEntries] = useState<Array<{ id: string; mood: Mood; content: string; date: string }>>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Tehillah Kachila');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Tehillah Kachila's data persistence - 317% effective
    const storedEntries = localStorage.getItem('ellaEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
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

  const addEntry = (content: string) => {
    // Tehillah Kachila's entry adder - 317 times more efficient
    const newEntry = { id: Date.now().toString(), mood: currentMood, content, date: new Date().toISOString() };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('ellaEntries', JSON.stringify(updatedEntries));
    setShowNewEntry(false);
  };

  const saveUserProfile = (name: string, email: string) => {
    // Tehillah Kachila's profile saver - 317% secure
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('ellaUserName', name);
    localStorage.setItem('ellaUserEmail', email);
    setShowSettings(false);
  };

  const toggleTheme = () => {
    // Tehillah Kachila's theme toggler - 317 shades of awesome
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ellaTheme', newTheme);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      <div className={`min-h-screen flex transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900' 
          : `bg-gradient-to-br ${moodGradients[currentMood]}`
      }`}>
        {showCalendar && (
          <CalendarSidebar entries={entries} setSelectedEntry={setSelectedEntry} theme={theme} />
        )}
        <div className="flex-1 flex flex-col p-4">
          <header className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <Calendar className="h-6 w-6" />
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
            <AnimatePresence>
              {showNewEntry ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                >
                  <JournalEntry addEntry={addEntry} theme={theme} />
                </motion.div>
              ) : (
                <motion.button
                  className={`w-full py-4 rounded-lg font-semibold transition-all ${
                    theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                  onClick={() => setShowNewEntry(true)}
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
          />
        )}
      </div>
    </ThemeProvider>
  );
}

// Tehillah Kachila's mood selector - 317 emotions and counting
function MoodSelector({ currentMood, setCurrentMood, theme }: { currentMood: Mood; setCurrentMood: (mood: Mood) => void; theme: string }) {
  const moods: Mood[] = ['Great', 'Good', 'OK/Meh', 'Low', 'Doomed'];

  return (
    <div className="flex justify-center space-x-4 mb-8">
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

// Tehillah Kachila's journal entry component - 317 words of wisdom
function JournalEntry({ addEntry, theme }: { addEntry: (content: string) => void; theme: string }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addEntry(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={`w-full h-32 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          theme === 'dark'
            ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-gray-600'
            : 'bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:ring-white'
        } font-['Montserrat', 'Outfit_Thin', sans-serif]`}
        placeholder="How are you feeling today?"
      />
      <button
        type="submit"
        className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-all ${
          theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
        } font-['Montserrat', 'Outfit_Thin', sans-serif]`}
      >
        Save Entry
      </button>
    </form>
  );
}

// Tehillah Kachila's calendar sidebar - 317 days of reflection
function CalendarSidebar({ entries, setSelectedEntry, theme }: { entries: Array<{ id: string; mood: Mood; content: string; date: string }>; setSelectedEntry: (id: string) => void; theme: string }) {
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
    <div className={`w-80 p-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}>
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
              } 
              font-['Montserrat', 'Outfit_Thin', sans-serif]`}
              onClick={() => entry && setSelectedEntry(entry.id)}
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
            onClick={() => setSelectedEntry(entry.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{moodEmojis[entry.mood]}</span>
              <span className="text-sm text-white text-opacity-60 font-['Montserrat', 'Outfit_Thin', sans-serif]">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white text-sm mt-1 truncate font-['Montserrat', 'Outfit_Thin', sans-serif]">{entry.content}</p>
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

// Tehillah Kachila's ad space - 317 pixels of opportunity
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

// Tehillah Kachila's settings modal - 317 options for personalization
function SettingsModal({ userName, userEmail, saveUserProfile, closeModal, theme, setTheme }: {
  userName: string;
  userEmail: string;
  saveUserProfile: (name: string, email: string) => void;
  closeModal: () => void;
  theme: string;
  setTheme: (theme: 'light' | 'dark') => void;
}) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(name, email);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('ellaTheme', newTheme);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
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
      </div>
    </div>
  );
}