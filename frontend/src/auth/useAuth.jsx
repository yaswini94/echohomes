import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function determineUserType(userId) {
      try {
        // Check if the user is a builder
        const isBuilder = await checkIdExists("builders", userId, "builder_id");
        if (isBuilder) {
          setUserRole("builder");
          return;
        }

        // Check if the user is buyer
        const isBuyer = await checkIdExists("buyers", userId, "buyer_id");
        if (isBuyer) {
          setUserRole("buyer");
          return;
        }

        // Check if the user is a supplier
        const isSupplier = await checkIdExists(
          "suppliers",
          userId,
          "supplier_id"
        );
        if (isSupplier) {
          setUserRole("supplier");
          return;
        }

        // If none of the above, set a default or handle the user differently
        console.log("No specific user type found.");
      } catch (err) {
        console.error("Error:", err);
      }
    }

    async function checkIdExists(tableName, id, key) {
      const { data, error } = await supabase
        .from(tableName)
        .select(key)
        .eq(key, id)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        return false;
      }

      return data ? true : false;
    }

    if (user?.id) {
      determineUserType(user?.id);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, role: userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
