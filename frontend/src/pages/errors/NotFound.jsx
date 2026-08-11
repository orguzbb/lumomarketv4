import { Link } from "react-router-dom";
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-6xl font-bold text-brand">404</h1>
    <p className="text-xl mt-4">Sahifa topilmadi</p>
    <Link to="/" className="mt-6 bg-brand text-white px-6 py-2 rounded">
      Bosh sahifaga qaytish
    </Link>
  </div>
);
export default NotFound;
