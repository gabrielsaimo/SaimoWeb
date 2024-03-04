import React, { useEffect, useState, useMemo } from "react";
import {
  BookOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MessageOutlined,
  PieChartOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Button, theme, Typography, Layout } from "antd";
import Relatorios from "./Realatorios";
import Menssagem from "./Menssagem";
import Dashboard from "./Dasboard";
import Pedidos from "./Pedidos";
import Users from "./Users";
import LayoutSite from "./LayoutSite";
import { useParams } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const MenuDashboard = () => {
  const { Company } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [tela, setTela] = useState(1);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [dateUser, setDateUser] = useState();
  const [userNome, setUserNome] = useState("");
  const [UserCategoria, setUserCategoria] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // Defina aqui o ponto de quebra para dispositivos móveis
      setCollapsed(window.innerWidth < 768);
    }

    handleResize(); // Verifica o tamanho da tela inicialmente
    window.addEventListener("resize", handleResize); // Adiciona um listener para redimensionamento

    return () => {
      window.removeEventListener("resize", handleResize); // Remove o listener ao desmontar o componente
    };
  }, []);
  useEffect(() => {
    getCachedDateUser();
  }, []);

  const cachedContent = useMemo(
    () => ({
      1: <Dashboard atualizar={null} user={dateUser} company={Company} />,
      2: <Relatorios />,
      3: <Menssagem atualizar={true} user={dateUser} />,
      4: <Pedidos atualizar={true} user={dateUser} />,
      5: <Users atualizar={true} user={dateUser} />,
      6: <LayoutSite atualizar={true} user={dateUser} />,
    }),
    [dateUser, Company]
  );

  const getCachedDateUser = () => {
    const cachedData = localStorage.getItem("dateUser");
    if (cachedData) {
      setDateUser(JSON.parse(cachedData));
      setUserNome(JSON.parse(cachedData).name);
      setUserCategoria(JSON.parse(cachedData).categoria);
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

  const logout = () => {
    window.location.href = window.location.origin + "/login/logout";
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#FFF", margin: 10, fontWeight: "bold" }}>
            {userNome} - {UserCategoria}
          </div>
        </div>
        <Menu
          props={Company}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["0"]}
          style={{ height: "100%", borderRight: 0 }}
          items={[
            {
              key: "1",
              icon: <BookOutlined />,
              disabled: false,
              label: "Catalogo",
              disabled:
                UserCategoria === "Gerente"
                  ? false
                  : UserCategoria === "ADM"
                  ? false
                  : true,
              onClick: () => {
                setTela(1);
                setCollapsed(true);
              },
            },
            {
              key: "2",
              icon: <PieChartOutlined />,
              label: "Relatorios",
              disabled: UserCategoria === "ADM" ? false : true,
              onClick: () => {
                setTela(2);
                setCollapsed(true);
              },
            },
            {
              key: "3",
              icon: <MessageOutlined />,
              label: "Mensagens",
              onClick: () => {
                setTela(3);
                setCollapsed(true);
              },
            },
            {
              key: "4",
              icon: <TagOutlined />,
              label: "Pedidos",
              onClick: () => {
                setTela(4);
                setCollapsed(true);
              },
            },
            {
              key: "5",
              icon: <UserOutlined />,
              disabled: UserCategoria === "ADM" ? false : true,
              label: "Usuários",
              onClick: () => {
                setTela(5);
                setCollapsed(true);
              },
            },
            {
              key: "6",
              icon: <LogoutOutlined />,
              label: "Layout",
              onClick: () => {
                setTela(6);
                setCollapsed(true);
              },
            },

            {
              key: "7",
              icon: <LogoutOutlined />,
              label: "Sair",
              onClick: () => {
                logout();
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
          }}
        >
          <Button
            icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              border: "none",
              width: 64,
              height: 64,
            }}
          />

          <Typography.Title
            level={3}
            style={{
              color: "#000",
              margin: 10,
              fontWeight: "bold",
            }}
          >
            {tela === 1
              ? "Catalogo"
              : tela === 2
              ? "Relatórios"
              : tela === 3
              ? "Mensagens"
              : tela === 4
              ? "Pedidos"
              : tela === 5
              ? "Usuários"
              : tela === 6
              ? "Layout"
              : "Sair"}
          </Typography.Title>
        </Header>
        <Content
          style={{
            margin: "0px",
            padding: 10,
            background: colorBgContainer,
          }}
        >
          {cachedContent[tela]}
        </Content>
      </Layout>
    </Layout>
  );
};
export default MenuDashboard;
