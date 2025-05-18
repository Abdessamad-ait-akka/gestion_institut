import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authService';
import { getEmplois } from '../api/emploiService';
import { fetchGroupes } from '../api/groupeApi';
import { getMatieres } from '../api/matiereService';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FaBook, FaClipboardList, FaCalendarAlt,FaClock ,FaTrashAlt,FaCheckCircle,FaRegCalendarCheck,FaUserGraduate} from 'react-icons/fa';

const EmploiTable = () => {
  const [emplois, setEmplois] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();
  const groupeIdUser = user?.groupe;

  const slots = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];
  const days = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [allEmplois, groupesData, matieresData] = await Promise.all([
          getEmplois(), fetchGroupes(), getMatieres()
        ]);
        setGroupes(groupesData);
        setMatieres(matieresData);
        setEmplois(allEmplois.filter(e => e.groupe_id === groupeIdUser));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, groupeIdUser]);

  const timeToMin = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };

  const renderCell = (day,slot) => {
    const slotMin = timeToMin(slot);
    const cours = emplois.find(e => 
      e.jour_semaine === day &&
      slotMin >= timeToMin(e.heure_debut) &&
      slotMin < timeToMin(e.heure_fin)
    );
    if (!cours) return null;
    const mat = matieres.find(m => m.id===cours.matiere_id)?.nom || '';
    return (
      <div className="text-sm">
        <div className="font-semibold">{mat}</div>
        <div className="text-gray-600"> {cours.salle}</div>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (!user) return    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
  <p className="font-semibold">Aucune connexion trouvée</p>
  <p className="text-sm">Veuillez vous connecter pour voir votre emploi du temps .</p>
</div>         
  return (
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <div className="sticky top-0 h-screen bg-gray-800">
      <Sidebar />
    </div>

    <div className="flex-1 flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>

      <main className="p-6 max-w-7xl mx-auto w-full overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl flex text-blue-800 font-bold mb-4">
            <FaRegCalendarCheck className="mr-3 mt-1"/>  Emploi du temps du groupe&nbsp;
              <span className="text-blue-600">
                {groupes.find(g=>g.id===groupeIdUser)?.nom_groupe || 'Inconnu'}
              </span>
            </h2>

            <div className="overflow-auto border rounded-lg bg-white shadow-sm">
              <table className="min-w-full table-auto">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="sticky left-0 bg-blue-50 z-10 border px-4 py-2 text-left">Jour / Heure</th>
                    {slots.map(slot => (
                      <th key={slot} className="border px-4 py-2 text-center">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day} className="hover:bg-gray-50 ">
                      <td className="sticky left-0 bg-white z-10 border px-4 py-2 font-medium">
                        {day}
                      </td>
                      {slots.map(slot => (
                        <td key={slot} className="border  px-4 py-3 align-top h-20">
                          {renderCell(day, slot)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmploiTable;
