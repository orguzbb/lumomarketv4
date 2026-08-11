import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <div className="space-y-2">
        <p>
          <strong>Ism:</strong> {user?.fullname}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Rol:</strong> {user?.role}
        </p>
      </div>
    </div>
  );
};
export default Profile;
