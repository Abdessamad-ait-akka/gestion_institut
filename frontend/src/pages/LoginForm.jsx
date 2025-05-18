// src/components/LoginForm.js
/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const user = await login(email, motDePasse);

      setSuccessMessage(`Bienvenue ${user.nom} ${user.prenom} !`);

      // ✅ Redirection par rôle
      if (user.role === 'etudiant') {
        navigate('/etudiant');
      } else if (user.role === 'enseignant') {
        navigate('/enseignant');
      } else if (user.role === 'administrateur') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginForm;
*/