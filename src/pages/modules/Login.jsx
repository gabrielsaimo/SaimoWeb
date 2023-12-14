import { Button, Divider, Flex, Input, message } from "antd";
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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const acessar = () => {
    GetUsuario();
  };
  useEffect(() => {
    getCachedDateUser();
  }, []);
  const GetUsuario = async () => {
    setVisible(true);
    const data = { name: name, password: password };

    const UserCollection = await getUser(data);

    if (UserCollection.user.length > 0) {
      localStorage.setItem("dateUser", JSON.stringify(UserCollection.user[0]));
      localStorage.setItem(
        "access_token",
        JSON.stringify(UserCollection.access_token)
      );

      if (UserCollection.user[0].active === false) {
        alert("Usuário desativado");
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
        alert("Usuário não tem permissão");
      }
    } else {
      alert("Senha incorreta");
      setVisible(false);
    }
  };
  const getCachedDateUser = () => {
    const cachedData = localStorage.getItem("dateUser");
    if (cachedData) {
      console.log(JSON.parse(cachedData), "teste");

      if (JSON.parse(cachedData).active === false) {
        alert("Usuário desativado");
      } else if (
        JSON.parse(cachedData).categoria === "ADM" ||
        JSON.parse(cachedData).categoria === "Gerência"
      ) {
      } else {
        alert("Usuário não tem permissão");
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
        <label>Nome</label>
        <Input type="text" onChange={(e) => setName(e.target.value)} />
        <label>Senha</label>
        <Input type="password" onChange={(e) => setPassword(e.target.value)} />
        <Divider />
        <Button
          onClick={acessar}
          type="primary"
          disabled={name === "" || password === "" ? true : false}
          loading={visible}
        >
          Acessar
        </Button>
      </div>
    </div>
  );
};

export default Login;
