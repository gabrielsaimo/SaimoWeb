import React from "react";
import { Layout, Menu, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/saimo.webp";
const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <Header style={{ position: "fixed", zIndex: 1, width: "100%", height: 80 }}>
      <div style={{ float: "left" }}>
        <Link to="/">
          <img
            src={logo}
            style={{ borderRadius: "100%", margin: "5px 30px 5px 10px" }}
            alt="SaimoWeb"
            height="64"
          />
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ margin: 5 }}
      >
        <Menu.Item key="1" style={{ borderRadius: 5 }}>
          Opção 1
        </Menu.Item>
        <Menu.Item key="2" style={{ borderRadius: 5 }}>
          Opção 2
        </Menu.Item>
        <Menu.Item key="3" style={{ borderRadius: 5 }}>
          Opção 3
        </Menu.Item>
      </Menu>
      <div style={{ position: "absolute", right: 10, top: 5 }}>
        <Button type="primary" style={{ marginRight: "10px" }}>
          <Link to="/login">Login</Link>
        </Button>
        <Button type="primary">
          <Link to="/register">Registro</Link>
        </Button>
      </div>
    </Header>
    <Content style={{ padding: "0 50px", flex: 1, marginTop: 70 }}>
      <Title>Criamos sites e aplicativos</Title>
      <Paragraph>
        Descrição detalhada sobre os serviços oferecidos pela SaimoWeb.
      </Paragraph>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      © {new Date().getFullYear()} SaimoWeb. Todos os direitos reservados.
    </Footer>
  </Layout>
);

export default Home;
