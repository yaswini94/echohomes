import { supabase } from "../supabase";
import VentureManagement from "./VentureManagement";

export default function Dashboard() {

  return (
    <div>
      <VentureManagement />
      <button
        className="button block"
        type="button"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}
