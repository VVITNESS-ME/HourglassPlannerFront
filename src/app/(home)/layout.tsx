import Hourglass from "@/components/hourglass/hourglass";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <main className="mt-24 flex flex-col justify-center items-center">
        {children}
        <Hourglass />
    </main>
  );
}