import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BASE_URL = "http://localhost:4000";

type Child = {
  id: string;
  name?: string;
  birthday?: string | null;
};

type ChildContextType = {
  children: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  updateChildren: () => Promise<void>;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children: ReactChildren }: any) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Load all children from backend
  const updateChildren = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    const res = await fetch(`${BASE_URL}/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data || !Array.isArray(data)) return;
    setChildren(data);

    // keep selected child if still exists
    setSelectedChild((prev) => {
      if (!prev) return data[0] || null;
      const match = data.find((c: Child) => c.id === prev.id);
      return match || data[0] || null;
    });
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChildren([]);
        setSelectedChild(null);
        return;
      }

      try {
        const token = await user.getIdToken();
        // Sync user + ensure default child exists
        const res = await fetch(`${BASE_URL}/users/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await res.text(); // 👈 IMPORTANT
        //console.log("RAW RESPONSE:", text);

        const data = JSON.parse(text);
        // Load full children list
        await updateChildren();
        // Set default child
        if (data.defaultChild) {
          setSelectedChild(data.defaultChild);
        }

      } catch (err) {
        console.error("ChildContext init error:", err);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ChildContext.Provider
      value={{
        children,
        selectedChild,
        setSelectedChild,
        updateChildren,
      }}
    >
      {ReactChildren}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error("useChild must be used within ChildProvider");
  }
  return context;
};