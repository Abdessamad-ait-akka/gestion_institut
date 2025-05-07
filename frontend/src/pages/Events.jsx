import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/eventService';
import { getCurrentUser } from '../api/authService';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const EventList = () => {
  const user = getCurrentUser();
  const userId = user?.id;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventsPerPage = 5;

  useEffect(() => {
    if (userId) fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(userId);
      const formatted = data.map(ev => ({
        id: ev.id,
        title: ev.title,
        start: ev.start_time || ev.start,
        end: ev.end_time || ev.end,
        description: ev.description,
      }));
      setEvents(formatted);
    } catch (error) {
      alert("Erreur de récupération des événements");
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Utilisateur non connecté !");
      return;
    }

    try {
      const eventData = {
        ...eventForm,
        user_id: userId
      };

      if (isEditing) {
        await updateEvent(currentEventId, eventData);
      } else {
        await createEvent(eventData);
      }

      setEventForm({ title: '', description: '', start: '', end: '' });
      setIsEditing(false);
      setCurrentEventId(null);
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (event) => {
    setEventForm({
      title: event.title,
      description: event.description || '',
      start: event.start,
      end: event.end
    });
    setIsEditing(true);
    setCurrentEventId(event.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Supprimer cet événement ?")) {
      await deleteEvent(eventId);
      fetchEvents();
    }
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">

        <Navbar />
        <div className="mb-6">
          <h1 className="text-2xl flex font-bold flex items-center text-pink-600 mb-4">
            <FaCalendarAlt size={30} className="mr-2 m-5" /> Calendrier des événements
          </h1>

          {user?.role === 'administrateur' && (
            <button
              onClick={() => {
                setEventForm({ title: '', description: '', start: '', end: '' });
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white flex ml-5 items-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlusCircle className='mr-2 ' /> Ajouter un événement
            </button>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? "Modifier l'événement" : "Créer un événement"}
              </h2>
              <form onSubmit={handleEventSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium">Titre</label>
                  <input type="text" name="title" value={eventForm.title} onChange={handleEventChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium">Description</label>
                  <textarea name="description" value={eventForm.description} onChange={handleEventChange} className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-4">
                  <label htmlFor="start" className="block text-sm font-medium">Début</label>
                  <input type="datetime-local" name="start" value={eventForm.start} onChange={handleEventChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
                </div>
                <div className="mb-6">
                  <label htmlFor="end" className="block text-sm font-medium">Fin</label>
                  <input type="datetime-local" name="end" value={eventForm.end} onChange={handleEventChange} required className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2">Annuler</button>
                  <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">{isEditing ? "Modifier" : "Créer"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Calendrier */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventClick={(info) => {
            const selected = events.find(e => e.id === parseInt(info.event.id));
            if (selected && user?.role === 'administrateur') handleEdit(selected);
          }}
          eventDidMount={(info) => {
            const now = new Date();
            const eventEnd = new Date(info.event.end);
            const eventStart = new Date(info.event.start);
            const el = info.el;

            if (eventEnd < now) {
              el.style.backgroundColor = 'rgba(99, 99, 99, 1)';
              el.style.textDecoration = 'line-through';
            } else {
              el.style.backgroundColor = 'rgba(99, 99, 99, 1)';
            }
            el.style.fontWeight = '700';
            el.style.fontFamily = 'Arial, sans-serif';

            const dayCell = document.querySelector(
              `.fc-daygrid-day[data-date='${eventStart.toISOString().split('T')[0]}']`
            );

            if (dayCell) {
              dayCell.classList.add(eventEnd < now ? 'past-event-day' : 'future-event-day');
            }
          }}
        />
      
        )}

        {/* Tableau */}
        {user?.role === 'administrateur' && (
          <>
            <hr className="my-6" />
            <h2 className="text-xl font-semibold mb-4">Liste des événements</h2>
            <table className="min-w-full bg-white border border-gray-300 shadow-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Titre</th>
                  <th className="border p-2">Début</th>
                  <th className="border p-2">Fin</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="border p-2">{event.title}</td>
                    <td className="border p-2">{formatDate(event.start)}</td>
                    <td className="border p-2">{formatDate(event.end)}</td>
                    <td className="border p-2 space-x-2">
                      <button onClick={() => handleEdit(event)} className="bg-blue-500 text-white px-2 py-1 rounded"><FaEdit /></button>
                      <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-2 py-1 rounded"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-4">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="bg-gray-300 px-4 py-2 rounded-l" disabled={currentPage === 1}>
                Précédent
              </button>
              <span className="py-2">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="bg-gray-300 px-4 py-2 rounded-r" disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;
