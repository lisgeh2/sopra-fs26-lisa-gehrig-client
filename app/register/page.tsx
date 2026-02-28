"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

type RegisterFormValues = {
  username: string;
  name: string;
  password: string;
  bio: string;
};

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  // useLocalStorage hook example use
  // The hook returns an object with the value and two functions
  // Simply choose what you need from the hook:
  const {
    // value: token, // is commented out because we do not need the token value
    set: setToken, // we need this method to set the value of the token to the one we receive from the POST request to the backend server API
    // clear: clearToken, // is commented out because we do not need to clear the token when logging in
  } = useLocalStorage<string>("token", ""); // note that the key we are selecting is "token" and the default value we are setting is an empty string
  // if you want to pick a different token, i.e "usertoken", the line above would look as follows: } = useLocalStorage<string>("usertoken", "");

const handleRegister = async (values: RegisterFormValues) => {
  try {
    // 1) Register (creates user, NO token)
    const created = await apiService.post<User>("/users", values);

    // 2) Login (returns token)
    const loginResponse = await apiService.post<User>("/login", {
      username: values.username,
      password: values.password,
    });

    // 3) Store token
    if (!loginResponse.token) {
      throw new Error("Login succeeded but no token was returned.");
    }

    setToken(loginResponse.token);

    // 4) Go to protected page
    router.push(`/users/${created.id}`); // or loginResponse.id if your login returns id
  } catch (error) {
    if (error instanceof Error) {
      alert(`Something went wrong during the Register:\n${error.message}`);
    } else {
      console.error("An unknown error occurred during Register.");
    }
  }
};

  return (
    <div className="login-container">
      <Form
        form={form}
        name="register"
        size="large"
        variant="outlined"
        onFinish={handleRegister}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Bio"
          rules={[{ required: true, message: "Please input a short bio!" }]}
        >
          <Input.TextArea placeholder="Short bio" maxLength={200} showCount />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="default" onClick={() => router.push("/login")} block>
            Back to Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Register;
