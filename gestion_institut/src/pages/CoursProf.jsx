import React, { useState } from 'react';

const CoursProf = () =>{
  const [titre, setTitre] = useState('');
  const [fichier, setFichier] = useState(null);

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log('Titre :', titre);
    console.log('Fichier :',fichier);
    alert('Cours uploade avec succes !');
  };
  return(
    <div style={styles.container}>
      <div style={styles.formContainer}>
      <h2>Uploader un cours</h2>
      <form onSubmit={handleSubmit}>
      <label>Titre du Cours : </label><br />
      <input 
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={{ padding: 8, marginBottom: 10, width: '100%'}}
          />
          <label>Fichier PDF :</label>
          <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFichier(e.target.files[0])}
          required
          style={{ }}
          />
          <button type="submit" style={styles.button}>Uploader</button>

      </form>

      
        </div>
                
        </div>
  );
};



const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex',
    alignItems: 'center',
    background: '#f9f9f9',
    padding: 20,
  },
  formContainer: {
    background: '#fff',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: 15,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  fileInput: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 12,
    background: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
  
  export default CoursProf;
  