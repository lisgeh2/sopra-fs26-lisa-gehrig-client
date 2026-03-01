"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Card, Form, Input } from "antd";


type UserPostPasswordDTO = {
  claimed_oldpassword: string;
  claimed_newpassword: string; // must match backend DTO field/getter
};
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
  
  const [form] = Form.useForm<UserPostPasswordDTO>(); // ✅ CHANGED: define form instance




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

}, [renderfinished, token, router]); // dependency apiService does not re-trigger the useEffect on every render because the hook uses memoization (check useApi.tsx in the hooks).
  // if the dependency array is left empty, the useEffect will trigger exactly once
  // if the dependency array is left away, the useEffect will run on every state change. Since we do a state change to users in the useEffect, this results in an infinite loop.
  // read more here: https://react.dev/reference/react/useEffect#specifying-reactive-dependencies


  const handlePasswordChange = async (values: UserPostPasswordDTO) => {
  try {
    await apiService.post("/edit_password", values); // ✅ CHANGED: values is now defined
    alert("Password changed. Please log in again.");
    handleLogout(); // optional but sane after password change

  } catch (error) {
    if (error instanceof Error) {
      alert(`Something went wrong while trying to change the password:\n${error.message}`);
    } else {
      console.error("An unknown error occurred while trying to change the password.");
    }
  }
};



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
    <div className="login-container">
      <Form
        form={form}
        name="edit_password"
        size="large"
        variant="outlined"
        onFinish={handlePasswordChange}
        layout="vertical"
      >
        <Form.Item
          name="oldpassword"
          label="old password"
          rules={[{ required: true, message: "Please input your old password!" }]}
        >
          <Input placeholder="Enter old password" />
        </Form.Item>
        <Form.Item
          name="nwpassword"
          label="new password"
          rules={[{ required: true, message: "Please input your new password!" }]}
        >
          <Input.Password password placeholder="Enter new password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Change password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;
