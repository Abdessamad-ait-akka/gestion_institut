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
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import frLocale from '@fullcalendar/core/locales/fr';

const EventList = () => {
  const user = getCurrentUser();
  const userId = user?.id_utilisateur;

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

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      toast.error("❌ Erreur lors du chargement des événements !");
      console.error('Erreur :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!loading) {
      const today = new Date();
      const dayCells = document.querySelectorAll('.fc-daygrid-day');

      dayCells.forEach(cell => {
        const dateStr = cell.getAttribute('data-date');
        if (!dateStr) return;

        const cellDate = new Date(dateStr);
        const hasEvent = events.some(event => {
          const eventDate = new Date(event.start);
          return eventDate.toDateString() === cellDate.toDateString();
        });

        cell.classList.remove('past-event-day', 'future-event-day');

        if (hasEvent) {
          if (cellDate < today) {
            cell.classList.add('past-event-day');
          } else if (cellDate >= today) {
            cell.classList.add('future-event-day');
          }
        }
      });
    }
  }, [events, loading]);

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.warn("⚠️ Utilisateur non connecté !");
      return;
    }

    try {
      const eventData = {
        ...eventForm,
        user_id: userId
      };

      if (isEditing) {
        await updateEvent(currentEventId, eventData);
        toast.info("✏️ Événement mis à jour avec succès!");

      } else {
        await createEvent(eventData);
        toast.success("✅ Événement créé avec succès !");
      }

      setEventForm({ title: '', description: '', start: '', end: '' });
      setIsEditing(false);
      setCurrentEventId(null);
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error("❌ Une erreur est survenue !");
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
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cet événement sera définitivement supprimé.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvent(eventId);
          toast.success("🗑️ Événement supprimé !");
          fetchEvents();
        } catch (error) {
          toast.error("❌ Erreur lors de la suppression !");
        }
      }
    });
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
    <div className="flex min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="sticky top-0 h-screen bg-gray-800">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl flex font-bold items-center text-pink-600 mb-4">
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
                <FaPlusCircle className='mr-2' /> Ajouter un événement
              </button>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ml-5 z-50">
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

          {loading ? (
            <Loader />
          ) : (
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            locale={frLocale}  // 👈 ici on met la locale française
            eventClick={(info) => {
              const selected = events.find(e => e.id === parseInt(info.event.id));
              if (selected && user?.role === 'administrateur') handleEdit(selected);
            }}
          />
          
          )}

          {user?.role === 'administrateur' && (
            <>
              <hr className="my-6" />
              <h2 className="text-xl font-semibold mb-4 ml-5">Liste des événements</h2>
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

              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="flex items-center">{`Page ${currentPage} sur ${totalPages}`}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventList;
