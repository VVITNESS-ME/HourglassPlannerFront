import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/img/logo_crop_yellowsand.svg" alt="hourglass" height={500} width={500}></Image>
    </main>
  );
}
