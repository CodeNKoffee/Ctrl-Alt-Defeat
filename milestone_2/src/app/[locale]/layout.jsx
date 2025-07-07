import ReduxProvider from '@/components/ReduxProvider';
import GlobalCallHandler from "@/components/GlobalCallHandler";
import IncomingCallTester from "@/components/IncomingCallTester";
import I18nProvider from "@/components/I18nProvider";
// import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children, params }) {
  return (
    <ReduxProvider>
      <I18nProvider>
        <GlobalCallHandler />
        {children}
        <IncomingCallTester />
        {/* <SpeedInsights /> */}
      </I18nProvider>
    </ReduxProvider>
  );
} 