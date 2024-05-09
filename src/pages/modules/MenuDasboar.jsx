import React, { useEffect, useState, useMemo } from "react";
import {
  BgColorsOutlined,
  BookOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  PieChartOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Button,
  theme,
  Typography,
  Layout,
  Spin,
  Modal,
  Drawer,
} from "antd";
import Relatorios from "./Realatorios";
import Dashboard from "./Dasboard";
import Pedidos from "./Pedidos";
import Users from "./Users";
import LayoutSite from "./LayoutSite";
import { useParams } from "react-router-dom";
import "../../css/MenuDashboard.css";
import { getImgLogo } from "../../services/config";
import Company from "./Company";

const MenuDashboard = () => {
  const { CompanyParams } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [tela, setTela] = useState(1);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [dateUser, setDateUser] = useState();
  const [userNome, setUserNome] = useState("");
  const [UserCategoria, setUserCategoria] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { Header, Sider, Content } = Layout;
  const [imgSrc, setImgSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getImgLogos();
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // Defina aqui o ponto de quebra para dispositivos móveis
      setCollapsed(window.innerWidth < 768);
    }

    handleResize(); // Verifica o tamanho da tela inicialmente
    window.addEventListener("resize", handleResize); // Adiciona um listener para redimensionamento

    getCachedDateUser();
    return () => {
      window.removeEventListener("resize", handleResize); // Remove o listener ao desmontar o componente
    };
  }, []);

  const getImgLogos = async () => {
    const idcompany = JSON.parse(
      localStorage.getItem("dateUser")
    ).user_profile_json;
    idcompany.forEach(async (company) => {
      const img = await getImgLogo(company.idcompany);

      if (img && CompanyParams === company.company) {
        setImgSrc(img[0]);
      }
    });
  };

  const cachedContent = useMemo(
    () => ({
      1: <Dashboard atualizar={null} user={dateUser} company={CompanyParams} />,
      2: <Relatorios />,
      3: <Pedidos atualizar={true} user={dateUser} />,
      4: <Users atualizar={true} user={dateUser} />,
      5: <LayoutSite atualizar={true} user={dateUser} />,
    }),
    [dateUser, CompanyParams]
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
        <div className="user-info">
          <div className="user-name">
            {userNome} - {UserCategoria}
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
            {imgSrc ? (
              <div className="company-card-container">
                <img
                  src={atob(imgSrc?.imagem)}
                  alt="img"
                  style={{
                    width: 50,
                    marginRight: 5,
                    borderRadius: 10,
                    marginLeft: 16,
                    border: "solid 1px #000000",
                  }}
                />
                <b style={{ color: "#FFF" }}>
                  {collapsed ? null : CompanyParams}
                </b>
              </div>
            ) : (
              <Spin />
            )}
          </div>
        </div>
        <Menu
          props={CompanyParams}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="menu"
          items={[
            {
              key: "1",
              icon: <BookOutlined />,
              label: "Catalogo",
              disabled:
                UserCategoria === "Gerência"
                  ? false
                  : UserCategoria === "ADM"
                  ? false
                  : true,
              onClick: () => {
                setTela(1);
                setCollapsed(false);
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
              icon: <TagOutlined />,
              label: "Pedidos",
              onClick: () => {
                setTela(3);
                setCollapsed(true);
              },
            },
            {
              key: "4",
              icon: <UserOutlined />,
              disabled:
                UserCategoria === "Gerência"
                  ? false
                  : UserCategoria === "ADM"
                  ? false
                  : true,
              label: "Usuários",
              onClick: () => {
                setTela(4);
                setCollapsed(true);
              },
            },
            {
              key: "5",
              icon: <BgColorsOutlined />,
              label: "Layout",
              onClick: () => {
                setTela(5);
                setCollapsed(true);
              },
            },

            {
              key: "6",
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
          className="header"
          style={{
            background: colorBgContainer,
          }}
        >
          <Button
            icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="menu-button"
          />

          <Typography.Title level={3} className="title">
            {tela === 1
              ? "Catalogo"
              : tela === 2
              ? "Relatórios"
              : tela === 3
              ? "Pedidos"
              : tela === 4
              ? "Usuários"
              : tela === 5
              ? "Layout"
              : "Sair"}
          </Typography.Title>
        </Header>
        <Content
          className="content"
          style={{
            background: colorBgContainer,
          }}
        >
          {cachedContent[tela]}
        </Content>
      </Layout>
      <Modal
        open={showModal}
        footer={false}
        onCancel={() => setShowModal(false)}
        width={380}
      ></Modal>
      <Drawer
        placement={"top"}
        closable={false}
        size="large"
        onClose={() => setShowModal(false)}
        open={showModal}
      >
        <Company />
      </Drawer>
    </Layout>
  );
};
export default MenuDashboard;
