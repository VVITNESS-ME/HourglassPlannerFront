import Hourglass from "@/components/hourglass/hourglass";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <Hourglass width={350}/>
      <h1>CI/CD Git Actions Test</h1>
    </div>
  );
}
