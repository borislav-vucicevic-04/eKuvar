import { useEffect } from 'react';
import Preloader from '../../components/Preloader/Preloader';
import Style from './LogOut.module.css';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

const fetchLogOut = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Logout failed');
  }
  return response.json(); // must resolve a value
};

export default function LogOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<{ success: boolean }>({
    queryKey: ['log-out'],
    queryFn: fetchLogOut,
    retry: false, // optional: disable retry for logout
  });

  useEffect(() => {
    if (data?.success) {
      queryClient.clear(); // clears all cached queries
      // Optionally redirect
      setTimeout(() => {
        navigate('/login'); // or home, or wherever
      }, 1500);
    }
  }, [data, queryClient, navigate]);

  if (isLoading) return <Preloader preloaderText={'Odjava u toku...'} />;
  if (error) return <p>Došlo je do interne greške na serveru!</p>;

  return (
    <div className={Style.container}>
      <div className={Style.logInForm}>
        <h1>Uspješno ste se odjavili!</h1>
      </div>
    </div>
  );
}
