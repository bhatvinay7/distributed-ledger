import Navbar from '../../components/nav-bar'
import SidebarController from '../../components/sidebar-controller';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
       <div className={`w-full h-screen flex flex-col `}>
        <Navbar/>
        <div className=' bg-white relative grid  grid-cols-1 sm:grid-cols-[auto_1fr] '>
        <SidebarController/>
        <div className='h-screen flex flex-col p-4'>
        {children}
        </div>
        </div>
        </div>
  );
}
