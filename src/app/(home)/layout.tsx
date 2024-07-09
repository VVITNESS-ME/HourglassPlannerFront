import Hourglass from "@/components/hourglass/hourglass";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <div className="">
        {children}
        {/* <Hourglass /> */}
    </div>
  );
}