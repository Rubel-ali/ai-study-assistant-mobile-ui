import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments, useRootNavigationState, useGlobalSearchParams } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";
import { setCredentials } from "../src/redux/authSlice";
import { getToken, saveToken } from "../src/services/storage";
import { View, ActivityIndicator } from "react-native";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import "../global.css";

// Disable Reanimated strict mode warnings caused by React Navigation/Expo Router
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

function RootNavigation() {
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSelectedCategory = useAppSelector((state) => state.preferences.hasSelectedCategory);
  const [isReady, setIsReady] = useState(false);
  const rootNavigationState = useRootNavigationState();
  
  // Handle deep links for social auth
  const params = useGlobalSearchParams();
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  useEffect(() => {
    if (params?.token && !isAuthenticated) {
      setIsProcessingToken(true);
      const token = params.token as string;
      const userId = (params.userId as string) || 'unknown';
      
      const processToken = async () => {
        try {
          dispatch(
            setCredentials({
              user: { id: userId, name: 'Student', email: '' }, 
              token: token,
            })
          );
          await saveToken(token);
        } catch (error) {
          console.error("Failed to process token from URL", error);
        } finally {
          setIsProcessingToken(false);
        }
      };
      
      processToken();
    }
  }, [params?.token, isAuthenticated, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      try {
        // Add a timeout to prevent hanging on device native bridge errors
        const tokenPromise = getToken();
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
        const token = await Promise.race([tokenPromise, timeoutPromise]);
        
        if (token && isMounted) {
          dispatch(
            setCredentials({
              token,
              user: { id: '1', name: 'Student', email: 'student@example.com' }, // Placeholder
            })
          );
        }
      } catch (error) {
        console.error("Failed to restore token", error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    initializeAuth();
    return () => { isMounted = false; };
  }, [dispatch]);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key || isProcessingToken) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = (segments[0] as string) === "(onboarding)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/(auth)/login");
    } else if (isAuthenticated) {
      if (!hasSelectedCategory && !inOnboardingGroup) {
        router.replace("/(onboarding)/category-select" as any);
      } else if (hasSelectedCategory && (inAuthGroup || inOnboardingGroup)) {
        router.replace("/(app)" as any);
      }
    }
  }, [isAuthenticated, hasSelectedCategory, isReady, segments, rootNavigationState?.key, isProcessingToken]);

  if (!isReady || isProcessingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
        <ActivityIndicator size="large" color="#818cf8" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}
