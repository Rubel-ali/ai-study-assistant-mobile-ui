import { useEffect, useState } from "react";
import { Slot, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { useAppDispatch, useAppSelector } from "../src/redux/hooks";
import { setCredentials } from "../src/redux/authSlice";
import { getToken } from "../src/services/storage";
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
  const [isReady, setIsReady] = useState(false);
  const rootNavigationState = useRootNavigationState();

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
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/(app)" as any);
    }
  }, [isAuthenticated, isReady, segments]);

  if (!isReady) {
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
