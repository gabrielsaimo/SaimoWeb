import { Button, Divider, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { getUser } from "../../services/user.ws";
import { useParams } from "react-router-dom";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const { msn } = useParams();
  useEffect(() => {
    if (msn === "error") {
      message.error("Usuário sem permissão", 5);
      localStorage.removeItem("dateUser");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
    } else if (msn === "logout") {
      message.success("Usuário deslogado", 5);
      localStorage.removeItem("dateUser");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
    }
  }, [msn]);

  const [password, setPassword] = useState("");

  const [form] = Form.useForm();

  const acessar = () => {
    GetUsuario();
  };
  useEffect(() => {
    getCachedDateUser();
  }, []);
  const GetUsuario = async () => {
    setVisible(true);
    const data = { email: form.getFieldValue("email"), password: password };

    const UserCollection = await getUser(data);

    if (UserCollection.user.length > 0) {
      localStorage.setItem("dateUser", JSON.stringify(UserCollection.user[0]));
      localStorage.setItem(
        "access_token",
        JSON.stringify(UserCollection.access_token)
      );

      if (UserCollection.user[0].active === false) {
        message.error("Usuário desativado");
      } else if (
        UserCollection.user[0].categoria === "ADM" ||
        UserCollection.user[0].categoria === "Gerência"
      ) {
        window.location.href = "/dashboard/" + UserCollection.user[0].company;
      } else if (UserCollection.user[0].categoria === "Garçom") {
        window.location.href = "/Garçom/" + UserCollection.user[0].company;
      } else if (UserCollection.user[0].categoria === "Cozinha") {
        window.location.href = "/Cozinha/" + UserCollection.user[0].company;
      } else {
        message.error("Usuário não tem permissão", 5);
      }
    } else {
      message.error("Usuário ou senha inválidos", 5);
      setVisible(false);
    }
  };
  const getCachedDateUser = () => {
    const cachedData = localStorage.getItem("dateUser");
    if (cachedData) {
      console.log(JSON.parse(cachedData), "teste");

      if (JSON.parse(cachedData).active === false) {
        message.error("Usuário desativado");
      } else if (
        JSON.parse(cachedData).categoria === "ADM" ||
        JSON.parse(cachedData).categoria === "Gerência"
      ) {
      } else {
        message.error("Usuário não tem permissão");
      }
    }
    return cachedData ? JSON.parse(cachedData) : null;
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "linear-gradient(to right,#00ff00 , #0a4bff)",
      }}
    >
      <div
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
          display: "grid",
          gridGap: "10px",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor, insira seu email",
                type: "email",
                pattern: new RegExp(
                  "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$"
                ),
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor, insira sua senha",
                min: 8,
              },
            ]}
          >
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
        </Form>

        <Divider />
        <Button
          onClick={acessar}
          type="primary"
          disabled={!form.getFieldValue("email") || !password}
          loading={visible}
        >
          Acessar
        </Button>

        <Divider />

        <Button
          onClick={() => {
            window.location.href = "/Forgot";
          }}
          type="link"
        >
          Esqueci a senha
        </Button>
      </div>
    </div>
  );
};

export default Login;
