"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { UserStatus } from "@/types/status";
import { User } from "@/types/user";
import { Button, Card } from "antd";
// antd component library allows imports of types
// Optionally, you can import a CSS module or file for additional styling:
// import "@/styles/views/Dashboard.scss";

// your code here for S2 to display a single user profile after having clicked on it
// each user has their own slug /[id] (/1, /2, /3, ...) and is displayed using this file
// try to leverage the component library from antd by utilizing "Card" to display the individual user
// import { Card } from "antd"; // similar to /app/users/page.tsx

// For components that need React hooks and browser APIs,
// SSR (server side rendering) has to be disabled.
// Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

const UserProfile: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>(); //if the URL is /users/7, params.id is "7" (string).
  const apiService = useApi();
  const [user, setUser] = useState<User | null>(null);
  const [renderfinished, setRenderFinished] = useState(false);

  const {value: token} = useLocalStorage<string>("token", ""); 
  const {clear: clearToken} = useLocalStorage<string>("token", ""); 
  


  const handleLogout = (): void => {
    // Clear token using the returned function 'clear' from the hook
    clearToken();
    router.push("/login");
  };


useEffect(() => {
  setRenderFinished(true);
}, []);


useEffect(() => {
    if (!renderfinished) return;

    if (!token) {
      router.push("/login");
      return;
    }


  const fetchUsers = async () => {
    
    try {

      const users: User[] = await apiService.get<User[]>("/users");
      console.log("Fetched users:", users);

      const matchedUser = users.find((u) => String(u.id) === params.id);

      if (matchedUser) {
        console.log("Matched user:", matchedUser);
        setUser(matchedUser);
      } else {
        console.warn("No user found for id:", params.id);
        setUser(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong while fetching users:\n${error.message}`);
      } else {
        console.error("An unknown error occurred while fetching users.");
      }
    }
  };

  fetchUsers();
}, [renderfinished, token, router, apiService, params.id]); // dependency apiService does not re-trigger the useEffect on every render because the hook uses memoization (check useApi.tsx in the hooks).
  // if the dependency array is left empty, the useEffect will trigger exactly once
  // if the dependency array is left away, the useEffect will run on every state change. Since we do a state change to users in the useEffect, this results in an infinite loop.
  // read more here: https://react.dev/reference/react/useEffect#specifying-reactive-dependencies


  // CHANGED: UI states now match the real flow
  if (!renderfinished) {
    return (
      <div className="card-container">
        <Card loading title="Checking authentication..." />
      </div>
    );
  }

if (token == "") {
  return (
    <div className="card-container">
      <Card loading title="Redirecting to login..." />
    </div>
  );
}


  return (
    <div className="card-container">
      <Card title={`User Profile Page (ID: ${params.id})`} className="dashboard-container">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22 }}
          >
          {user ? ( // ✅ FIXED (guard against null)
            <>
              <div>Username: {user.username}</div>
              <div>Online Status: {user.status}</div>
              <div>Bio: {user.bio || "-"}</div>
              <div>Creation date: {user.creationDate || "-"}</div>
              <div> </div>
            </>
          ) : (
            <div>Loading user...</div> // ✅ FIXED (fallback UI)
          )}
          </div>


    <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 12, }}> 
        <Button
          type="primary"
          onClick={() => router.push("/users")}
        >
          Users Overview
        </Button>
        <Button
          ghost
          onClick={() => router.push("/users/edit_password")}
        >
          Change your Password
        </Button>
          <Button
            danger
            onClick={handleLogout}
          >
            Logout
          </Button>
      </div>
      </Card>
    </div>
  );
};

export default UserProfile;
