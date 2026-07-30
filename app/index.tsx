import { Redirect } from 'expo-router';
import { useAppSelector } from '../src/redux/hooks';

export default function Index() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSelectedCategory = useAppSelector((state) => state.preferences.hasSelectedCategory);
  
  if (isAuthenticated) {
    if (hasSelectedCategory) {
      return <Redirect href={"/(app)" as any} />;
    }
    return <Redirect href={"/(onboarding)/category-select" as any} />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
