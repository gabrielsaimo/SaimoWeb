import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../../css/Collapse.css";
import {
  deleteCategoty,
  getCategoty,
  postCategoty,
  putCategoty,
} from "../../services/category.ws";

const { Option } = Select;

export default function Category() {
  const [cardapioCategory, setCardapioCategory] = useState([]);
  const [action, setAction] = useState(false);
  const [id, setId] = useState("");
  const [order, setOrder] = useState(0);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [modalNewAction, setModalNewAction] = useState(false);
  const [Company] = useState(window.location.href.split("/").pop());
  const [loading, setLoading] = useState(false);
  const companySelectd = JSON.parse(
    localStorage.getItem("companySelectd")
  ).idcompany;
  const handleOk = () => {
    message.loading({ content: "Salvando...", key: "updatable" });
    setLoading(true);
    handleSave();

    setTimeout(() => {
      setLoading(false);
      closeModal();
    }, 2000);
  };

  useEffect(() => {
    filterTable();
  }, [search, cardapioCategory]);

  function filterTable() {
    const filteredData = cardapioCategory.filter(
      (record) =>
        !search ||
        record["name"].toLowerCase().indexOf(search.toLowerCase()) > -1
    );
    setSearchData(filteredData);
  }

  useEffect(() => {
    if (!action) {
      fetchData();
    }
  }, [action, Company]);
  async function fetchData() {
    console.log("Company1", companySelectd);
    const cardapioCollection = await getCategoty(companySelectd, Company);
    setCardapioCategory(cardapioCollection);
  }

  async function handleSave() {
    try {
      if (selectedTaskId) {
        await postCategoty({ id, name, order, active, company: Company });
        message.success("Item atualizado com sucesso!");
      } else {
        await putCategoty({
          id:
            cardapioCategory.length + 1 + Math.floor(Math.random() * 100000000),
          name,
          order,
          active,
          idcompany: JSON.parse(localStorage.getItem("companySelectd"))
            .idcompany,
        });
        setTimeout(() => {
          message.success("Categoria salva com sucesso!");
        }, 1000);
      }
      fetchData();
      setAction(!action);
    } catch (error) {
      console.error(error);
      message.error("Erro ao salvar categoria.");
    }
  }

  function handleClickEdit(task) {
    setSelectedTaskId(task.id);
    setId(task.id);
    setName(task.name);
    setActive(task.active);
    handleShowModalNewAction();
  }

  async function confirmDelete(record) {
    try {
      await deleteCategoty(record);
      message.success("Item deletado com sucesso!");
      setAction(!action);
      fetchData();
    } catch (error) {
      console.error(error);
      message.error("Erro ao excluir categoria.");
    }
  }

  function handleShowModalNewAction() {
    setModalNewAction(true);
  }

  function disableSave() {
    return !name || active === "" || active === null;
  }

  function clearSelecteds() {
    setSelectedTaskId(null);
    setId("");
    setName("");
    setActive(true);
  }

  function closeModal() {
    setModalNewAction(false);
    fetchData();
    clearSelecteds();
  }

  const columns = [
    {
      title: "Ordem",
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Categoria",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Ativo",
      dataIndex: "active",
      key: "active",
      render: (text) => (text ? "Sim" : "Não"),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <div>
          <Button
            style={{ backgroundColor: "yellow" }}
            onClick={() => handleClickEdit(record)}
          >
            <EditOutlined size={24} color="#00CC66" />
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir essa tarefa?"
            onConfirm={() => confirmDelete(record)}
            okText="Excluir"
            okButtonProps={{ danger: true }}
            cancelText="Cancelar"
          >
            <Button style={{ backgroundColor: "red" }}>
              <DeleteOutlined size={24} style={{ color: "#fff" }} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={8}>
        <Col span={24}>
          <Card bordered={false}>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ width: "100%", display: "flex" }}>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleShowModalNewAction}
                  >
                    Novo
                  </Button>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Input
                    allowClear
                    value={search}
                    placeholder="Pesquisar"
                    prefix={<SearchOutlined color="#00CC66" />}
                    suffix={<FilterOutlined color="#00CC66" />}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Table dataSource={searchData} columns={columns} />
      <Modal
        open={modalNewAction}
        okButtonProps={{ disabled: disableSave() }}
        onCancel={closeModal}
        title={selectedTaskId ? "Atualizar Categoria" : "Nova Categoria"}
        footer={[
          <Button key="back" onClick={closeModal}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row justify="center">
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 170 }}>
                Ordem
              </Typography.Title>
              <InputNumber
                style={{ width: 350, margin: "10px 0" }}
                size="large"
                min={0}
                changeOnWheel
                type="number"
                placeholder="Ordem"
                value={order}
                onChange={(e) => setOrder(e)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 170 }}>
                Nome
              </Typography.Title>

              <Input
                style={{ width: 350, margin: "10px 0" }}
                size="large"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 170 }}>
                Ativo?
              </Typography.Title>
              <Select
                style={{ width: 380, margin: "10px 0" }}
                size="large"
                showSearch
                placeholder="Ativo"
                optionFilterProp="children"
                onChange={(value) => setActive(value)}
                defaultValue={active}
              >
                <Option value={true}>Sim</Option>
                <Option value={false}>Não</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
