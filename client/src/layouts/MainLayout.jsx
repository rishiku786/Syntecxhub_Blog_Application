import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingBlobs from '../components/common/FloatingBlobs';
import ScrollToTop from '../components/common/ScrollToTop';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingBlobs />
      <Navbar />
      <main style={{ paddingTop: '5.5rem', flex: '1 1 0%', minWidth: 0 }}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
