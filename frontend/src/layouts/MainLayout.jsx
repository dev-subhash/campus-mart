import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className={`mx-auto w-full max-w-6xl flex-1 px-4 ${hideFooter ? 'min-h-0 overflow-hidden py-4' : 'py-8'}`}>
      {children}
    </main>
    {!hideFooter && <Footer />}
  </div>
);

export default MainLayout;
