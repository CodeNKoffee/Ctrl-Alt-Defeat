import ReduxProvider from '@/components/ReduxProvider';
import GlobalCallHandler from "@/components/GlobalCallHandler";
import IncomingCallTester from "@/components/IncomingCallTester";
// import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children, params }) {
  return (
    <ReduxProvider>
      <GlobalCallHandler />
      {children}
      <IncomingCallTester />
      {/* <SpeedInsights /> */}
    </ReduxProvider>
  );
} 