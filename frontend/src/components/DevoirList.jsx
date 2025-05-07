import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DevoirList = () => {
  const [devoirs, setDevoirs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5003/devoirs')
      .then(res => setDevoirs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des Devoirs</h2>
      <ul>
        {devoirs.map(d => (
          <li key={d.id}>
            <strong>{d.titre}</strong> - Limite: {d.date_limite}
            {d.fichier && (
              <a
                href={`http://localhost:5003/devoirs/download/${d.fichier}`}
                style={{ marginLeft: 10 }}
                target="_blank" rel="noopener noreferrer"
              >
                📎 Télécharger
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevoirList;
