import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Clock, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import { SESSIONS, type Session } from '../data/sessions';

export const Catalog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Initialize states from URL or default values
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [selectedDay, setSelectedDay] = useState(queryParams.get('day') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'All');
  const [selectedSpeaker, setSelectedSpeaker] = useState(queryParams.get('speaker') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(queryParams.get('level') || 'All');
  const [selectedTrack, setSelectedTrack] = useState(queryParams.get('track') || 'All');

  // Update URL whenever filter states change
  useEffect(() => {
    const newQueryParams = new URLSearchParams();
    if (searchQuery) newQueryParams.set('search', searchQuery);
    if (selectedDay !== 'All') newQueryParams.set('day', selectedDay);
    if (selectedCategory !== 'All') newQueryParams.set('category', selectedCategory);
    if (selectedSpeaker !== 'All') newQueryParams.set('speaker', selectedSpeaker);
    if (selectedLevel !== 'All') newQueryParams.set('level', selectedLevel);
    if (selectedTrack !== 'All') newQueryParams.set('track', selectedTrack);

    navigate({ search: newQueryParams.toString() }, { replace: true });
  }, [searchQuery, selectedDay, selectedCategory, selectedSpeaker, selectedLevel, selectedTrack, navigate]);

  const days = ['All', 'Day 1', 'Day 2', 'Day 3'];
  const categories = ['All', 'Keynote', 'Breakout', 'Customer Story', 'Learning Lab', 'Expo'];
  
  // Extract unique speakers, levels, and tracks
  const allSpeakers = useMemo(() => {
    const speakers = SESSIONS.map(session => session.speaker).flat();
    return ['All', ...Array.from(new Set(speakers))].sort();
  }, [SESSIONS]);

  const allLevels = useMemo(() => {
    const levels = SESSIONS.map(session => session.details?.level).filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(levels))].sort((a, b) => {
      const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'All': 0 };
      return (order[a as keyof typeof order] || 0) - (order[b as keyof typeof order] || 0);
    });
  }, [SESSIONS]);

  const allTracks = useMemo(() => {
    const tracks = SESSIONS.map(session => session.details?.tracks || []).flat();
    return ['All', ...Array.from(new Set(tracks))].sort();
  }, [SESSIONS]);

  const filteredSessions = useMemo<Session[]>(() => {
    return SESSIONS.filter(session => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.details?.fullDescription && session.details.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDay = selectedDay === 'All' || session.day === selectedDay;
      const matchesCategory = selectedCategory === 'All' || session.category === selectedCategory;
      const matchesSpeaker = selectedSpeaker === 'All' || session.speaker === selectedSpeaker;
      const matchesLevel = selectedLevel === 'All' || session.details?.level === selectedLevel;
      const matchesTrack = selectedTrack === 'All' || session.details?.tracks?.includes(selectedTrack);

      return matchesSearch && matchesDay && matchesCategory && matchesSpeaker && matchesLevel && matchesTrack;
    });
  }, [searchQuery, selectedDay, selectedCategory, selectedSpeaker, selectedLevel, selectedTrack]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Session Catalog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore our schedule of events, keynotes, and workshops.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search sessions, speakers, or topics..."
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Day Filter */}
              <div className="relative">
                <select
                  aria-label="Filter by Day"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  aria-label="Filter by Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <Filter className="h-4 w-4" />
                </div>
              </div>

              {/* Speaker Filter */}
              <div className="relative">
                <select
                  aria-label="Filter by Speaker"
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {allSpeakers.map((speaker) => (
                    <option key={speaker} value={speaker}>{speaker}</option>
                  ))}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  aria-label="Filter by Level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {allLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <Filter className="h-4 w-4" />
                </div>
              </div>

              {/* Tracks Filter */}
              <div className="relative">
                <select
                  aria-label="Filter by Track"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  {allTracks.map((track) => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredSessions.length} sessions
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={session.id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${session.category === 'Keynote' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        session.category === 'Breakout' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        session.category === 'Learning Lab' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                      {session.category}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {session.day}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {session.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 flex-grow">
                    {session.description}
                  </p>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      {session.speaker}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="h-4 w-4 mr-2 text-slate-400" />
                      {session.time}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                      {session.location}
                    </div>
                  </div>

                  <Link 
                    to={`/catalog/${session.id}`}
                    className="mt-6 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No sessions found</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
