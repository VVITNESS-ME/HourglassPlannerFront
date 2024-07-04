import Hourglass from "@/components/hourglass/hourglass";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <div className="mt-24 flex flex-col justify-center items-center">
        {children}
        <Hourglass />
    </div>
  );
}