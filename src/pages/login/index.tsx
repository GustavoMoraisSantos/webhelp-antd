import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google");
  };

  useEffect(() => {
    const checkSession = async () => {
      const result = await getSession();
      if (result?.user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {status === "loading" ? (
        <Spin size="large" />
      ) : !session ? (
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleSignIn}
          loading={loading}
        >
          Login with Google
        </Button>
      ) : null}
    </div>
  );
};

export default LoginPage;
