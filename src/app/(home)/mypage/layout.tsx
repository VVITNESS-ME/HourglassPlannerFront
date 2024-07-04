import Sidebar from '../../../components/sidebar/sidebar'

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <div>
        <Sidebar />
        {children}
    </div>
  );
}