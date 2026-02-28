"use client";
import { useRouter } from "next/navigation";
import { Button, Card, Table } from "antd";
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


const UserProfile = () => {
  const router = useRouter();

  return (
    <div className="card-container">
      <Card title="User Profile" className="dashboard-container">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22 }}
          >
            <div>Username: Max_Muster</div>
            <div>Online Status: Online</div>
            <div>Creation Date: 01.01.2024</div>
            <div>Bio: Hello world</div>
            <div> </div>
          </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}> 
        <Button
          type="primary"
          onClick={() => router.push("/users")}
        >
          Users Overview
        </Button>
      </div>
      </Card>
    </div>
  );
};

export default UserProfile;
