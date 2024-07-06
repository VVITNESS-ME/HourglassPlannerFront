import Sidebar from '../../../components/mypage/sidebar/sidebar'

export default function MypageLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  return (
    <div>
        <Sidebar />
        {children}
    </div>
  );
}