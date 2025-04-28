import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [scale, setScale] = useState(1);

  const onMouseDown = () => setScale(0.96);
  const onMouseUp = () => setScale(1);

  const handleLogin = () => {
    console.log('Inscription:', email, password);
    alert('Inscription réussie ! 🎉');
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Login</h1>

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <div style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}>
          <button
            style={styles.button}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 140,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 70,
    fontWeight: '700',
    marginBottom: 30,
    color: '#1a1a1a',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f4f8',
    padding: '14px 16px',
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    width: '100%',
    background: 'linear-gradient(to right, #007AFF, #00B0FF)',
    padding: '14px 0',
    borderRadius: 25,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0px 4px 5px rgba(0, 122, 255, 0.3)',
    transition: 'transform 0.2s',
  },
};

export default Login;
