/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Button, Card, Descriptions, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
  getPedidoId,
  getPedidos,
  postPedidosStatus,
  postPedidostatus,
  veryfyStatusPedidos,
} from "../../services/Pedidos.ws";
import { getCardapio } from "../../services/cardapio.ws";
import { postEmail } from "../../services/email.ws";
import io from "socket.io-client";
import moment from "moment/moment";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
import { getDatabase, onValue, ref, set } from "firebase/database";
import sound from "../../assets/notification.wav";
import soundError from "../../assets/error.wav";
import { useParams } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyDHuslm5iZZGtOk3ChXKXoIGpQQQI4UaUQ",
  authDomain: "encanto-amapaense.firebaseapp.com",
  projectId: "encanto-amapaense",
  storageBucket: "encanto-amapaense.appspot.com",
  messagingSenderId: "66845466662",
  appId: "1:66845466662:web:6d45a230c3b2ccf49fc6e7",
  measurementId: "G-T9LP3T7QBB",
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
const service = initializeApp(firebaseConfig);
const database = getDatabase(service);
const mensagensRef = ref(database, "data");

export default function Cozinha() {
  const { Company } = useParams();
  const data = new Date();

  const hora = data.getHours();
  const dataFormatada =
    hora + ":" + data.getMinutes() + ":" + data.getSeconds();

  const [pedidos, setPedido] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [modalCancelamento, setModalCancelamento] = React.useState(false);
  const [idPedido, setIdPedido] = React.useState("");
  const [obsCancelamento, setObsCancelamento] = React.useState("");
  const text = obsCancelamento;
  const statusIndex = text.indexOf("Status");
  const beforeStatus = text.slice(0, statusIndex).trim();
  const afterStatus = text.slice(statusIndex).trim();
  const [api, contextHolder] = notification.useNotification();
  const [idCompany] = useState(
    JSON.parse(localStorage.getItem("dateUser")).idcompany
  );

  const [pedidoss, setPedidos] = useState([]);
  const openNotification = (placement, title, notifi, type) => {
    if (type === "success") {
      api.success({
        message: `${title}`,
        description: `${notifi}`,
        placement,
      });
    } else {
      api.error({
        message: `${title}`,
        description: `${notifi}`,
        placement,
      });
    }
  };
  useEffect(() => {
    onValue(mensagensRef, (snapshot) => {
      const mensagens = snapshot.val();
      openNotification(
        "topRight",
        mensagens.title,
        mensagens.notification,
        mensagens.type
      );
      getPedido();

      if (mensagens.type === "success") {
        new Audio(sound).play();
      } else {
        new Audio(soundError).play();
      }
    });
  }, []);

  function atualizarMensagens(title, notification) {
    const mensagens = {
      title,
      notification,
    };

    set(mensagensRef, mensagens)
      .then(() => {
        console.log("Mensagens atualizadas com sucesso.");
      })
      .catch((error) => {
        console.error("Erro ao atualizar as mensagens:", error);
      });
  }

  useEffect(() => {
    const socket = io("http://192.168.12.11:3020"); // Substitua 'http://localhost:3000' pela URL correta do seu servidor

    socket.on("notification", (data) => {
      if (data.company === Company) {
        openNotification("topRight", data.title, data.notification);
        getPedido();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getPedidoss();
  }, [pedidos]);
  useEffect(() => {
    getPedido();
  }, [modalCancelamento]);
  const getPedido = async () => {
    const pedidos = await getPedidos(idCompany);
    setPedido(pedidos);
  };

  useEffect(() => {
    getCardapios();
  }, []);
  const getCardapios = async () => {
    const cardapio = await getCardapio(Company);
    setCardapio(cardapio);
  };
  async function getPedidoss() {
    const pedidos = await getPedidoId(idCompany);
    setPedidos(pedidos);
  }

  const StatusPedido = async (data, status, pedido) => {
    const dataPedido = {
      id: data.id,
      status: status,
      acepted_by: JSON.parse(localStorage.getItem("dateUser")).name,
      acepted_at: new Date(),
      update_at: new Date(),
      update_by: JSON.parse(localStorage.getItem("dateUser")).name,
    };

    await postPedidostatus(dataPedido);

    const returnVerify = await veryfyStatusPedidos(pedido.pedidos);
    if (returnVerify.length === 1) {
      StatusPedidoFinal(pedido.id, status);
    }
    getPedido();
  };

  const StatusPedidoFinal = async (id, status) => {
    if (status === "Cancelado") {
      const destinararios = [
        "gabrielsaimo68@gmail.com",
        "Josemaria023182@gmail.com",
        "sraebarbossa@gmail.com",
      ];
      const email = {
        destinatario: destinararios,
        assunto: "Pedido Cancelado",
        corpo: `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Email de Cancelamento</title><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background-color:#f5f5f5;}.container{max-width:600px;margin:0 auto;background-color:#fff;padding:20px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.1);}h1{color:#333;margin-top:0;}p{margin-bottom:20px;}.signature{margin-top:40px;font-style:italic;color:#888;}</style></head><body><div class='container'><h1>Pedido Cancelado</h1><p>Cancelado por: ${
          JSON.parse(localStorage.getItem("dateUser")).name
        },</p><p>Pedido N° ${id} foi cancelado.</p><p>Motivo do cancelamento:</p><p>${obsCancelamento}</p><br><br/><p>Atenciosamente,</p><p><em>Encando Amapaense</em></p></div></body></html>`,
      };
      await postEmail(email).catch((err) => {
        console.log(err);
        return;
      });
    }
    if (status === "Em Preparo") {
      const data = {
        id: id,
        status: status,
        acepted_by: JSON.parse(localStorage.getItem("dateUser")).name,
        acepted_at: new Date(),
        update_at: new Date(),
        update_by: JSON.parse(localStorage.getItem("dateUser")).name,
      };
      await postPedidosStatus(data);
    } else {
      const data = {
        id: id,
        status: status,
        finished_by:
          status === "Pronto" || status === "Cancelado"
            ? JSON.parse(localStorage.getItem("dateUser")).name
            : null,
        finished_at:
          status === "Pronto" || status === "Cancelado" ? new Date() : null,
        update_at: new Date(),
        update_by: JSON.parse(localStorage.getItem("dateUser")).name,
        taxa: 0,
      };
      await postPedidosStatus(data);
    }
    getPedido();
  };

  const logout = () => {
    window.location.href = window.location.origin + "/login/logout";
  };

  const confirmarCancelamento = () => {
    setModalCancelamento(false);
    StatusPedidoFinal(idPedido, "Cancelado");
    setObsCancelamento("");
  };
  const cachedData = localStorage.getItem("dateUser");
  if (cachedData === null) {
    return (window.location.href = "/Login");
  }
  console.log(JSON.parse(cachedData).company, Company);
  if (JSON.parse(cachedData).company !== Company) {
    return (window.location.href = "/Login/error");
  }

  return (
    <Card
      style={{
        backgroundImage:
          "url(https://img.freepik.com/fotos-gratis/vista-lateral-do-chef-queimando-um-prato-na-cozinha_23-2148763118.jpg?w=1380&t=st=1698719436~exp=1698720036~hmac=086f3a4813af89ce79e7b81da27744f6b692ca453f7b959f4587ef1c7f98e10f)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <Card style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
        {JSON.parse(localStorage.getItem("dateUser")).name}
        {contextHolder}
        <div style={{ float: "right" }}>
          <Button onClick={() => logout()}>Sair</Button>
        </div>

        <h1>Atualizado as {dataFormatada}</h1>
        {pedidos.map((pedido) => (
          <div style={{ marginBottom: 10 }}>
            <Descriptions
              bordered
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                borderRadius: 10,
              }}
              column={{
                xxl: 4,
                xl: 3,
                lg: 3,
                md: 3,
                sm: 2,
                xs: 1,
              }}
            >
              <Descriptions.Item label="N° Pedido">
                {pedido.id}
              </Descriptions.Item>
              <Descriptions.Item label="Mesa">{pedido.mesa}</Descriptions.Item>
              <Descriptions.Item label="Hora do pedido">
                {moment(pedido.created_at).format("HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={
                    pedido.status === "Em Analize"
                      ? "warning"
                      : pedido.status === "Cancelado"
                      ? "error"
                      : pedido.status === "Em Cancelamento"
                      ? "error"
                      : pedido.status === "Pronto"
                      ? "success"
                      : pedido.status === "Em Preparo"
                      ? "processing"
                      : "default"
                  }
                  text={pedido.status}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Pedido" span={2}>
                {cardapio.length > 0 && pedidoss.length > 0 ? (
                  pedidoss.map((pedidoss) => (
                    <>
                      {pedido.pedidos === pedidoss.idpedido ? (
                        <>
                          {pedidoss.qdt > 0 ? (
                            <p>
                              x{pedidoss.qdt} {pedidoss.item}
                              {pedidoss.categoria !== "Bebidas" &&
                              pedidoss.categoria !== "Sucos exóticos" &&
                              pedidoss.categoria !== "Drinks" &&
                              pedidoss.categoria !== "Cerveja" ? (
                                pedidoss.status !== "Cancelado" &&
                                pedidoss.status !== "Finalizado" &&
                                pedidoss.status !== "Em Cancelamento" &&
                                pedidoss.status !== "Pronto" ? (
                                  <Button
                                    onClick={() => {
                                      StatusPedido(
                                        pedidoss,
                                        pedidoss.status === "Em Analize"
                                          ? "Em Preparo"
                                          : pedido.status === "Em Preparo"
                                          ? "Pronto"
                                          : "Finalizado",
                                        pedido
                                      );
                                    }}
                                    type="primary"
                                    style={{
                                      marginLeft: 10,
                                      backgroundColor:
                                        pedidoss.status === "Em Analize"
                                          ? "orange"
                                          : pedidoss.status === "Em Preparo"
                                          ? "green"
                                          : "purple",
                                    }}
                                  >
                                    {pedidoss.status === "Em Analize"
                                      ? "Em Preparo"
                                      : pedidoss.status === "Em Preparo"
                                      ? "Pronto"
                                      : null}
                                  </Button>
                                ) : null
                              ) : null}
                              {pedidoss.status === "Em Cancelamento" ? (
                                <Button
                                  style={{
                                    marginLeft: 10,
                                    backgroundColor: "red",
                                  }}
                                  type="primary"
                                  onClick={() => {
                                    setIdPedido(pedido.id);
                                    setObsCancelamento(pedido.obs_cancel);
                                    setModalCancelamento(true);
                                    //  StatusPedidoFinal(pedido.id, "Cancelado");
                                  }}
                                >
                                  Confimar?
                                </Button>
                              ) : null}
                            </p>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  ))
                ) : (
                  <p>Carregando...</p>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Oberservação" span={1}>
                {pedido.obs}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ))}
        <Modal
          title="Motivo do Cancelamento"
          open={modalCancelamento}
          okType="danger"
          okText="Cancelar Pedido"
          onOk={() => {
            confirmarCancelamento();
          }}
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => setModalCancelamento(false)}
        >
          <h2>{beforeStatus}</h2>
          <h3>{afterStatus}</h3>
        </Modal>
      </Card>
    </Card>
  );
}
