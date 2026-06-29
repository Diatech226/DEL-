import './globals.css';import Navbar from '../components/Navbar';import Footer from '../components/Footer';
export const metadata={title:'DEL',description:'Placement, location et vente d’engins industriels'};
export default function RootLayout({children}){return <html lang="fr"><body><Navbar/><main>{children}</main><Footer/></body></html>}
