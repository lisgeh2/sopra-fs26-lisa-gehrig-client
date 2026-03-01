// this code is part of S2 to display a list of all registered users
// clicking on a user in this list will display /app/users/[id]/page.tsx
"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Card, Table } from "antd";
import type { TableProps } from "antd"; // antd component library allows imports of types
// Optionally, you can import a CSS module or file for additional styling:
// import "@/styles/views/Dashboard.scss";

// Columns for the antd table of User objects
const columns: TableProps<User>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
];


const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);
  const [renderfinished, setRenderFinished] = useState(false);
  const {value: token} = useLocalStorage<string>("token", ""); 
  const {clear: clearToken} = useLocalStorage<string>("token", ""); 
  
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:


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
    
    if (token == "") {
      router.push("/login");
      return;
    }


    const fetchUsers = async () => {
    try {
        // apiService.get<User[]> returns the parsed JSON object directly,
        // thus we can simply assign it to our users variable.
        const users: User[] = await apiService.get<User[]>("/users");
        setUsers(users);
        console.log("Fetched users:", users);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching users:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      }
    };

    fetchUsers();
  },[
    renderfinished, token, apiService, router,]);
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
      <Card
        title="Get all users from secure endpoint:"
        loading={!users}
        className="dashboard-container"
      >
        {users && (
          <>
            {/* antd Table: pass the columns and data, plus a rowKey for stable row identity */}
            <Table<User>
              columns={columns}
              dataSource={users}
              rowKey="id"
              onRow={(row) => ({
                onClick: () => router.push(`/users/${row.id}`),
                style: { cursor: "pointer" },
              })}
            />
            <Button 
            danger
            onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
