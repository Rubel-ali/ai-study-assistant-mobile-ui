import { Redirect } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  if (isAuthenticated) {
    return <Redirect href={"/(app)" as any} />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
