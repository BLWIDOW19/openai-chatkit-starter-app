import { ChatKitPanel } from "./components/ChatKitPanel";

export default function App() {
  return (
    <main className="flex h-[100dvh] flex-col bg-slate-100 dark:bg-slate-950 md:min-h-screen md:items-center md:justify-end">
  <div className="h-full w-full md:mx-auto md:max-w-5xl">
        <ChatKitPanel />
      </div>
    </main>
  );
}
