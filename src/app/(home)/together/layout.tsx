import RootLayout from "@/components/together/facelandmark-demo/app/layout";

export default function TogetherLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <div className="">
        {children}
        <RootLayout children={undefined} />
    </div>
  );
}