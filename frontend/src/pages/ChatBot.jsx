// App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getCurrentUser } from '../api/authService';
import { User, Bot, ChevronDown, Clock , BrainCircuit, Cpu, MessageSquare, BotMessageSquare} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import { FaBook, FaClipboardList, FaCalendarAlt,FaClock ,FaTrashAlt,FaCheckCircle,FaRegCalendarCheck,FaUserGraduate} from 'react-icons/fa';

function Spinner() {
  return (
    <div className="flex justify-center items-center mt-2">
      <svg
        className="animate-spin h-6 w-6 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Chargement en cours"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );
}

export default function ChatAI() {
  const [msg, setMsg] = useState('');
  const [botText, setBotText] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPageDate, setCurrentPageDate] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const itemsPerPage = 5;
  const evtRef = useRef(null);
  const user = getCurrentUser();

  const fetchHistory = async () => {
    if (!user?.id_utilisateur) return;
    try {
      const res = await fetch(`http://localhost:5000/api/discussions?utilisateur_id=${user.id_utilisateur}`);
      if (!res.ok) throw new Error("Erreur lors du chargement de l'historique");
      setHistory(await res.json());
    } catch (error) {
      toast.error(error.message || 'Erreur lors du chargement.');
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => evtRef.current?.close();
  }, []);

  const startStream = () => {
    if (!msg) {
      toast.warn("Veuillez saisir une question avant d'envoyer.");
      return;
    }
    setBotText('');
    setLoading(true);
    evtRef.current?.close();

    const es = new EventSource(
      `http://localhost:5000/api/bot/stream?prompt=${encodeURIComponent(msg)}&utilisateur_id=${user.id_utilisateur}`
    );
    evtRef.current = es;

    es.onmessage = (e) => {
      setBotText((prev) => prev + e.data);
    };
    es.onerror = () => {
      es.close();
      setLoading(false);
      fetchHistory();
      toast.success('Réponse reçue avec succès !');
    };
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const handleEdit = async (id, oldMessage) => {
    const newMsg = prompt('Modifier le message utilisateur :', oldMessage);
    if (!newMsg || newMsg === oldMessage) return;

    try {
      const res = await fetch(`http://localhost:5000/api/discussions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_utilisateur: newMsg }),
      });
      if (!res.ok) throw new Error('Erreur lors de la modification.');
      toast.success('Message modifié avec succès.');
      fetchHistory();
    } catch {
      toast.error('Erreur lors de la modification.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette discussion ?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/discussions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression.');
      toast.success('Discussion supprimée.');
      fetchHistory();
    } catch {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const groupByDate = (items) =>
    items.reduce((acc, item) => {
      const date = new Date(item.date_creation).toLocaleDateString();
      (acc[date] = acc[date] || []).push(item);
      return acc;
    }, {});

  const grouped = groupByDate(history);
  const allDates = Object.keys(grouped);
  const paginatedDates = allDates.slice((currentPageDate - 1) * itemsPerPage, currentPageDate * itemsPerPage);
  const current = selectedDate ? grouped[selectedDate] : history;
  const paginatedHistory = current.slice((currentPageHistory - 1) * itemsPerPage, currentPageHistory * itemsPerPage);

  return (
<div className="flex min-h-screen  bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark-via-gray-800 dark:to-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="flex-1 flex p-6 gap-6 overflow-auto">
          <section className="ww-full bg-white/80 border border-blue-200 shadow-md backdrop-blur-mdrounded-2xl p-4">
            <h4 className="text-lg text-blue-600 flex font-semibold mb-4"> <FaRegCalendarCheck  className=" mr-2 self-center" />Dates</h4>
            {paginatedDates.length === 0 ? (
              <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-sm">
  <svg
    className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 110-14 7 7 0 010 14z"
    />
  </svg>
  <p className="text-sm text-yellow-800 dark:text-yellow-200">Aucune discussion pour le moment.</p>
</div>
            ) : (
              <ul className="space-y-2">
                {paginatedDates.map((date) => (
                  <li key={date}>
                    <button
                      onClick={() => {
                        setSelectedDate(date);
                        setCurrentPageHistory(1);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        selectedDate === date ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {date}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between mt-4">
              <button disabled={currentPageDate === 1} onClick={() => setCurrentPageDate((p) => p - 1)} className="text-sm text-blue-600 hover:underline">Précédent</button>
              <button disabled={currentPageDate * itemsPerPage >= allDates.length} onClick={() => setCurrentPageDate((p) => p + 1)} className="text-sm text-blue-600 hover:underline">Suivant</button>
            </div>
            <button
              onClick={() => {
                setSelectedDate(null);
                setCurrentPageHistory(1);
              }}
              className="w-full text-left mt-2 text-sm text-center bg-red-600 hover:bg-blue-100 text-white rounded px-4 py-2"
            >
              Voir tout
            </button>
          </section>

          <section className="w-3/4 space-y-8">
            <div className="w-full bg-white/80 border border-blue-200 shadow-md backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r mb-4 flex from-blue-500 via-red-500 to-red-800 bg-clip-text text-transparent">   <Cpu className="w-10 h-10 text-blue-500 mr-2" />  Assistant IA</h2>
              <textarea
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Pose ta question..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={startStream}
                disabled={loading || !msg}
                className={`mt-4 px-6 py-2 rounded-full font-medium inline-flex items-center justify-center ${
                  loading || !msg ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {loading ? 'En cours...' : 'Envoyer'}
              </button>
              <pre className="mt-4 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap min-h-[4rem]">
                {loading && botText === '' ? <Spinner /> : botText}
              </pre>
            </div>

            <div className="w-full bg-white/80 border border-blue-200 shadow-md backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl flex font-semibold mb-4 bg-gradient-to-r mb-4 flex from-green-500 via-blue-500 to-gray-200 bg-clip-text text-transparent">
              <BotMessageSquare className="w-10 h-10 text-green-500 mr-2  " />   Historique {selectedDate && `du ${selectedDate}`}
              </h3>

              {paginatedHistory.length === 0 ? (
                <div className="flex items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-sm">
  <svg
    className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-2"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 110-14 7 7 0 010 14z"
    />
  </svg>
  <p className="text-sm text-yellow-800 dark:text-yellow-200">Aucune discussion pour le moment.</p>
</div>
              ) : (
                paginatedHistory.map((d) => {
                  const isExpanded = expandedIds.has(d.id);
                  const preview = d.reponse_bot.slice(0, 150);
                  return (
<div
  key={d.id}
  className="mb-8 last:mb-0 relative shadow-md border-t border-gray-300/40 dark:border-gray-700/60 pt-6"
>
  {/* Ligne verticale à gauche pour effet professionnel */}
  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-400 via-transparent to-indigo-400 opacity-40 rounded-full" />

  <div className="flex items-start mb-2 pl-6">
    <User className="w-5 h-5 text-indigo-500 mr-2" />
    <span className="font-medium text-gray-900 dark:text-gray-100">{d.message_utilisateur}</span>
  </div>

  <div className="flex items-start mb-2 pl-6">
    <Bot className="w-5 h-5 text-green-500 mr-2" />
    <p className="text-gray-800 dark:text-gray-300">
      {isExpanded
        ? d.reponse_bot
        : `${preview}${d.reponse_bot.length > 150 ? '…' : ''}`}
    </p>
  </div>

  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pl-6 mb-2">
    <Clock className="w-4 h-4 mr-1" />
    <span className="mr-auto">
      {new Date(d.date_creation).toLocaleString()}
    </span>
    {d.reponse_bot.length > 150 && (
      <button
        onClick={() => toggleExpand(d.id)}
        className="flex items-center text-indigo-600 hover:underline dark:text-indigo-400"
      >
        {isExpanded ? 'Réduire' : 'Lire plus'}
        <ChevronDown
          className={`w-4 h-4 ml-1 transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
    )}
  </div>

  <div className="flex space-x-4 pl-6">
    <button
      onClick={() => handleEdit(d.id, d.message_utilisateur)}
      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
    >
      Modifier
    </button>
    <button
      onClick={() => handleDelete(d.id)}
      className="text-sm text-red-600 hover:underline dark:text-red-400"
    >
      Supprimer
    </button>
  </div>
</div>

                  );
                })
              )}
              <div className="flex justify-between mt-4">
                <button disabled={currentPageHistory === 1} onClick={() => setCurrentPageHistory((p) => p - 1)} className="text-sm text-blue-600 hover:underline">Précédent</button>
                <button disabled={currentPageHistory * itemsPerPage >= current.length} onClick={() => setCurrentPageHistory((p) => p + 1)} className="text-sm text-blue-600 hover:underline">Suivant</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}