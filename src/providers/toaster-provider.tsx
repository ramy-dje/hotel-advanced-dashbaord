import { Toaster } from "react-hot-toast";

// The toaster provider

interface Props {
  children: React.ReactNode;
}

export default function ToasterProvider({ children }: Props) {
  return (
    <>
      <Toaster
        position="bottom-right"
        containerClassName=""
        toastOptions={{
          className: "w-[20em] z-[9999999999999]",
        }}
      />
      {children}
    </>
  );
}
