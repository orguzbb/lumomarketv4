import { Link } from "react-router-dom";
const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-6xl font-bold text-brand">401</h1>
    <p className="text-xl mt-4">Ruxsat yo'q</p>
    <Link to="/login" className="mt-6 bg-brand text-white px-6 py-2 rounded">
      Kirish
    </Link>
  </div>
);
export default Unauthorized;
