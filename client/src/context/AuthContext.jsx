import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, getOrgMe } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // job seeker
  const [org, setOrg]         = useState(null);   // organisation
  const [authType, setAuthType] = useState(null); // 'user' | 'org'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type  = localStorage.getItem('authType');
    if (!token || !type) { setLoading(false); return; }

    (async () => {
      try {
        if (type === 'user') {
          const res = await getMe();
          setUser(res.data.user);
          setAuthType('user');
        } else if (type === 'org') {
          const res = await getOrgMe();
          setOrg(res.data.org);
          setAuthType('org');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('authType');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authType', 'user');
    setUser(userData);
    setOrg(null);
    setAuthType('user');
  };

  const loginOrg = (token, orgData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('authType', 'org');
    setOrg(orgData);
    setUser(null);
    setAuthType('org');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    setUser(null);
    setOrg(null);
    setAuthType(null);
  };

  return (
    <AuthContext.Provider value={{ user, org, authType, loading, loginUser, loginOrg, logout, setUser, setOrg }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
