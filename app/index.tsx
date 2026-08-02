import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { setCredentials } from '../src/redux/authSlice';
import { saveToken } from '../src/services/storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { token, userId } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSelectedCategory = useAppSelector((state) => state.preferences.hasSelectedCategory);
  const [isProcessing, setIsProcessing] = useState(!!token);

  useEffect(() => {
    if (token) {
      const processToken = async () => {
        try {
          const t = Array.isArray(token) ? token[0] : token;
          const u = Array.isArray(userId) ? userId[0] : (userId || 'unknown');
          
          dispatch(
            setCredentials({
              user: { id: u, name: 'Student', email: '' }, 
              token: t,
            })
          );
          await saveToken(t);
        } catch (error) {
          console.error("Token processing error:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      processToken();
    }
  }, [token, dispatch]);

  if (isProcessing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  if (isAuthenticated) {
    if (hasSelectedCategory) {
      return <Redirect href={"/(app)" as any} />;
    }
    return <Redirect href={"/(onboarding)/category-select" as any} />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
