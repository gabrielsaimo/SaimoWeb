import { Button, Divider, Flex, Input } from "antd";
import React, { useEffect, useState } from "react";
import { getUser } from "../../services/user.ws";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dateUser, setDateUser] = useState();
  const [acessable, setAcessable] = React.useState(false);
  const [userNome, setUserNome] = useState("");
  const [UserCategoria, setUserCategoria] = useState("");
  const [Company_id, setCompany] = useState("");
  const acessar = () => {
    GetUsuario();
  };
  useEffect(() => {
    getCachedDateUser();
  }, []);
  const GetUsuario = async () => {
    const data = { name: name, password: password };

    const UserCollection = await getUser(data);
 

    if (UserCollection.user.length > 0) {
      setUserNome(UserCollection.user[0].name);
      setUserCategoria(UserCollection.user[0].categoria);
      setCompany(UserCollection.user[0].company);
      // Armazenar o valor no localStorage
      localStorage.setItem("dateUser", JSON.stringify(UserCollection.user[0]));
      localStorage.setItem(
        "access_token",
        JSON.stringify(UserCollection.access_token)
      );
      setDateUser(UserCollection);
      if (UserCollection.user[0].active === false) {
        alert("Usuário desativado");
        setAcessable(false);
      } else if (
        UserCollection.user[0].categoria === "ADM" ||
        UserCollection.user[0].categoria === "Gerência"
      ) {
        setAcessable(true);
        window.location.href = "/dashboard/" + UserCollection.user[0].company;
      } else {
        alert("Usuário não tem permissão");
        setAcessable(false);
      }
    } else {
      alert("Senha incorreta");
    }
  };
  const getCachedDateUser = () => {
    const cachedData = localStorage.getItem("dateUser");
    if (cachedData) {
      console.log(JSON.parse(cachedData),'teste');
      setDateUser(JSON.parse(cachedData));
      setUserNome(JSON.parse(cachedData).name);
      setUserCategoria(JSON.parse(cachedData).categoria);
      if (JSON.parse(cachedData).active === false) {
        alert("Usuário desativado");
        setAcessable(false);
      } else if (
        JSON.parse(cachedData).categoria === "ADM" ||
        JSON.parse(cachedData).categoria === "Gerência"
      ) {
        setAcessable(true);
        window.location.href =
          "/dashboard/" + JSON.parse(cachedData).company;
      } else {
        alert("Usuário não tem permissão");
        setAcessable(false);
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
        <Button onClick={acessar}>Acessar</Button>
      </div>
    </div>
  );
};

export default Login;
