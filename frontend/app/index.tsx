import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // For now, always redirect to login since user is not authenticated
    // In a real app, you would check authentication status here
    router.replace('/login');
  }, [router]);

  return null; // This component doesn't render anything
}
