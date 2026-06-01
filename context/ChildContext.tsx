import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  selectChild: (child: Child | null) => Promise<void>;
  updateChildren: () => Promise<void>;
  updateChildName: (childId: string, newName: string) => void;
  updateChildBirthDate: (childId: string, birthday: string | null) => void;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider = ({ children: ReactChildren }: any) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const selectChild = async (child: Child | null) => {
    setSelectedChild(child);

    if (child?.id) {
      await AsyncStorage.setItem("selectedChildId", child.id);
    } else {
      await AsyncStorage.removeItem("selectedChildId");
    }
  };

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
    //if (!data || !Array.isArray(data)) return;

    // keep selected child if still exists
    /*
    setSelectedChild((prev) => {
      if (!prev) return data[0] || null;
      const match = data.find((c: Child) => c.id === prev.id);
      return match || data[0] || null;
    });
    */
    setChildren(data);
  };

  const updateChildName = (childId: string, newName: string) => {
    setChildren(prev =>
      prev.map(child =>
        child.id === childId
          ? { ...child, name: newName }
          : child
      )
    );

    setSelectedChild(prev =>
      prev && prev.id === childId
        ? { ...prev, name: newName }
        : prev
    );
  };

  const updateChildBirthDate = (childId: string, birthday: string | null) => {
    setChildren(prev =>
      prev.map(child =>
        child.id === childId
          ? { ...child, birthday }
          : child
      )
    );

    setSelectedChild(prev =>
      prev && prev.id === childId
        ? { ...prev, birthday }
        : prev
    );
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setChildren([]);
        await AsyncStorage.removeItem("selectedChildId");
        setSelectedChild(null);
        return;
      }

      try {
        const token = await user.getIdToken();
        // Sync user
        await fetch(`${BASE_URL}/users/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        /*
        const text = await res.text();
        //console.log("RAW RESPONSE:", text);

        const data = JSON.parse(text);
        // Load full children list
        await updateChildren();
        // Set default child
        if (data.defaultChild) {
          setSelectedChild(data.defaultChild);
        }
        */

        // Load children
        const res = await fetch(`${BASE_URL}/children`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const childrenData = await res.json();
        setChildren(childrenData);
        const savedChildId = await AsyncStorage.getItem("selectedChildId");

        const restoredChild =
        childrenData.find((c: { id: string | null; }) => c.id === savedChildId) ||
        childrenData[0] ||
        null;

      setSelectedChild(restoredChild);
      if (restoredChild?.id) {
        await AsyncStorage.setItem("selectedChildId", restoredChild.id);
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
        selectChild,
        updateChildren,
        updateChildName,
        updateChildBirthDate,
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