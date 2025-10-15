import Image from "next/image";
import { Card } from "../ui/card";
import logo_ralf_horizental from "@/app/logo_ralf_horizental.svg";

// The app loading screen component
export default function AppLoadingScreen() {
  return (
    <main className="w-full select-none flex items-center justify-center h-screen bg-muted/80">
      <Card className="w-[22em] min-h-[10em] p-4 gap-2 flex flex-col justify-center items-center">
        <Image alt="" src={logo_ralf_horizental} width={240} height={80} />
        <p className="text-sm text-muted-foreground text-center">
          Welcome to Ralf dashboard , Please wait the dashboard is begin
          prepared
        </p>
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mt-4" />
      </Card>
    </main>
  );
}
