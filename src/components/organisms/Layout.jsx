import { useUser } from '@/contexts/UserContext';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Loading from '@/components/ui/Loading';
const Layout = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;