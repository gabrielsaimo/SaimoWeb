import { Button, Divider, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { getUser } from "../../services/user.ws";
import { useParams } from "react-router-dom";
import "../../css/Login.css";
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
      localStorage.clear();
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
      } else if (UserCollection.user[0].active === true) {
        window.location.href = "/Company";
      } else {
        message.error("Usuário não tem permissão", 5);
        setVisible(false);
      }
    } else {
      message.error("Usuário ou senha inválidos", 5);
      setVisible(false);
    }
  };
  const getCachedDateUser = () => {
    const cachedData = localStorage.getItem("dateUser");
    if (cachedData) {
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
    <div className="content-background">
      <div className="container">
        <Form form={form} layout="vertical">
          <Form.Item
            label={<p className="form-item-email">Email</p>}
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
            label={<p className="form-item-password">Senha</p>}
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
          type="primary"
        >
          Esqueci a senha
        </Button>
      </div>
    </div>
  );
};

export default Login;
