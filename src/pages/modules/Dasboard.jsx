import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  Suspense,
  lazy,
} from "react";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Divider,
  Space,
  Tour,
  Upload,
  Image,
  Carousel,
  Tag,
  Typography,
  Popover,
  Switch,
  QRCode,
  Spin,
} from "antd";
import "firebase/database";
import ImgCrop from "antd-img-crop";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
  MinusCircleOutlined,
  CheckCircleOutlined,
  StarFilled,
  StarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Category from "./Category";
import LazyLoad from "react-lazyload";
import {
  deleteCardapio,
  DeleteImg,
  getCardapio,
  getImgCardapio,
  InsertImg,
  postCardapio,
  putCardapio,
} from "../../services/cardapio.ws";
import { getCategoty } from "../../services/category.ws";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const LazyLoadedImage = lazy(() =>
  import("antd").then((module) => ({ default: module.Image }))
);
const { Option } = Select;
export default function Dashboard({ atualizar, user, company }) {
  const cachedData = localStorage.getItem("dateUser");
  if (localStorage.getItem("companySelectd") === null)
    return (window.location.href = "/Login/token");

  const companySelectd = JSON.parse(localStorage.getItem("companySelectd"));

  if (cachedData === null) return (window.location.href = "/Login");

  const validaEmpresa = JSON.parse(cachedData).user_profile_json.some(
    (objeto) => objeto.company === company
  );

  if (!validaEmpresa) {
    return (window.location.href = "/Login/error");
  }
  const queryClient = useQueryClient();
  const imgCache = localStorage.getItem("companyLogo");
  const [fileList, setFileList] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [modalNewAction, setModalNewAction] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [uptela, setUptela] = useState(false);
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sub, setSub] = useState("");
  const [highlight, setHighlight] = useState(false);
  const [imgByte, setImgByte] = useState("");
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState(null);
  const [actionCardapio, setActionCardapio] = useState(true);
  const [cardapioCategory, setCardapioCategory] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [modalCategory, setModalCategory] = useState(false);
  const [modalImgVisible, setModalImgVisible] = useState(false);
  const [imgModal, setImgModal] = useState(null);
  const random = Math.floor(Math.random() * 100000000);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const [totalImg, setTotalImg] = useState(0);
  const [coint, setCoint] = useState(0);
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState([]);
  const {
    isLoading: isLoadingCategory,
    error: errorCategory,
    data: dataCategory,
  } = useQuery({
    queryKey: "getCategory",
    queryFn: () => getCategoty(companySelectd.idcompany, company),
  });

  const {
    isLoading: isLoadingCardapio,
    error: errorCardapio,
    data: dataCardapio,
  } = useQuery({
    queryKey: ["getCardapio"],
    queryFn: () => getCardapio(companySelectd.idcompany, company),
  });

  const { mutateAsync: postCardapioFn } = useMutation({
    mutationFn: postCardapio,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["getCardapio"], (Data) => {
        return Data.map((item) =>
          item.id === variables.id
            ? {
                id: variables.id,
                name: variables.name,
                price: variables.price,
                description: variables.description,
                sub: variables.sub,
                active: variables.active,
                imagem: variables.imagem,
                highlight: variables.highlight,
                category: variables.category,
                number: variables.number,
                update_at: variables.update_at,
                update_by: variables.update_by,
                idcompany: variables.idcompany,
                company: company,
              }
            : item
        );
      });
      filterTable();
    },
  });

  const { mutateAsync: putCardapioFn } = useMutation({
    mutationFn: putCardapio,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["getCardapio"], (Data) => {
        return [
          ...Data,
          {
            id: variables.id,
            name: variables.name,
            price: variables.price,
            description: variables.description,
            sub: variables.sub,
            active: variables.active,
            imagem: variables.imagem,
            highlight: variables.highlight,
            category: variables.category,
            number: variables.number,
            update_at: variables.update_at,
            update_by: variables.update_by,
            idcompany: variables.idcompany,
            company: company,
          },
        ];
      });
      filterTable();
    },
  });

  const { mutateAsync: deleteCardapioFn } = useMutation({
    mutationFn: deleteCardapio,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["getCardapio"], (Data) => {
        return Data.filter((item) => item.id !== variables.id);
      });
      filterTable();
    },
  });

  useEffect(() => {
    if (
      dataCardapio?.length > 0 &&
      dataCategory?.length > 0 &&
      !isLoadingCardapio &&
      !isLoadingCategory
    )
      filterTable();
  }, [
    isLoadingCardapio,
    isLoadingCategory,
    filteredStatus,
    search,
    dataCardapio,
    dataCategory,
  ]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setCoint(coint + 1);
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768); // Defina aqui o ponto de quebra para dispositivos móveis (768 é um exemplo)
    }

    handleResize(); // Verifica o tamanho da tela inicialmente
    window.addEventListener("resize", handleResize); // Adiciona um listener para redimensionamento

    return () => {
      window.removeEventListener("resize", handleResize); // Remove o listener ao desmontar o componente
    };
  }, []);
  useEffect(() => {
    if (fileList.length > 0 && coint == 1) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        insertImg(reader.result);
      });
      reader.readAsDataURL(fileList[0].originFileObj);
    }
  }, [fileList[0]]);

  const insertImg = async (code) => {
    let body = {
      imagem: code,
      idreq: selectedTaskId,
      tipo: "cardapio",
      id: random,
      // update_at: new Date(),
      //  update_by: JSON.parse(cachedData)[0]?.name,
      //  idcompany: JSON.parse(cachedData)[0]?.idcompany,
      company: company,
    };
    if (code) await InsertImg(body);
    setUptela(!uptela);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const steps = [
    {
      title: "Bem vindo",
      description: "Bem vindo ao Dashboard.",
    },
    {
      title: "Adicionar Item",
      description: "Clique para adicionar um novo item.",
      target: () => ref1.current,
    },
    {
      title: "Pesquisar",
      description: "Pesquise por um item.",
      target: () => ref2.current,
    },
    {
      title: "Categorias",
      description: "Filtre por categoria.",
      target: () => ref3.current,
    },
    {
      title: "Editar Item ",
      description: "Clique para Editar.",
      target: () => ref4.current,
    },
    {
      title: "Deletar Item",
      description: "Clique para Deletar um item.",
      target: () => ref5.current,
    },
  ];

  async function confirmDelete(record) {
    await deleteCardapioFn(record);
    message.success("Item deletado com sucesso!");
    setActionCardapio(!actionCardapio);
  }

  async function confirmDeleteImg(record) {
    await DeleteImg(record.id, record.idreq);
    message.success("Imagem deletada com sucesso!");
    setActionCardapio(!actionCardapio);
  }

  function filterTable() {
    if (!search && !filteredStatus) {
      setSearchData(dataCardapio);
    } else {
      const array = dataCardapio.filter(
        (record) =>
          (!filteredStatus ||
            (record["category"] &&
              record["category"]
                ?.toUpperCase()
                .indexOf(filteredStatus.toUpperCase()) > -1)) &&
          (!search ||
            record["name"].toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            !search ||
            record["description"].toLowerCase().indexOf(search.toLowerCase()) >
              -1 ||
            !search ||
            record["id"].toString().indexOf(search.toLowerCase()) > -1)
      );
      setSearchData(array);
    }
  }

  function handleClickEdit(task) {
    setSelectedTaskId(task.id);
    setId(task.id);
    setName(task.name);
    setNumber(task.number);
    setPrice(task.price);
    setDescription(task.description);
    setSub(task.sub);
    setHighlight(task.highlight);
    setActive(task.active);
    setImgByte(task.img);
    setCategory(task.category);
    handleShowModalNewAction();
  }

  function handleShowModalNewAction() {
    setModalNewAction(true);
  }
  async function handleSave() {
    if (selectedTaskId) {
      try {
        await postCardapioFn({
          id,
          name,
          price,
          description,
          sub,
          active,
          imagem: imgByte,
          highlight,
          category,
          number,
          update_at: new Date(),
          update_by: JSON.parse(cachedData).name,
          idcompany: companySelectd.idcompany,
          company: company,
        });
        message.success("Item atualizado com sucesso!");
      } catch (error) {
        message.error("Erro ao atualizar item!");
      }
    } else {
      try {
        await putCardapioFn({
          id: dataCardapio.length + 1 + Math.floor(Math.random() * 100000000),
          name,
          price,
          description,
          sub,
          active,
          imagem: imgByte,
          highlight,
          category,
          number,
          update_at: new Date(),
          update_by: JSON.parse(cachedData).name,
          idcompany: companySelectd.idcompany,
          company: company,
        });
        message.success("Item salvo com sucesso!");
      } catch (error) {
        message.error("Erro ao salvar item!");
      }
    }
    setActionCardapio(!actionCardapio);
    closeModal();
    clearSelecteds();
    setUptela(!uptela);
  }

  function disableSave() {
    return !name || !price || active === "" || active === null || !category;
  }
  function clearSelecteds() {
    setSelectedTaskId(null);
    setId("");
    setName("");
    setNumber(0);
    setPrice("");
    setDescription("");
    setTotalImg(0);
    setSub("");
    setHighlight(false);
    setActive(true);
    setCategory(null);
    setImgModal(null);
    setImgByte("");
    setFileList([]);
    setCoint(0);
  }
  function closeModal() {
    if (modalCategory) {
      setModalCategory(false);
      setModalImgVisible(false);
    } else {
      setModalNewAction(false);
      setModalImgVisible(false);
      clearSelecteds();
    }
  }

  function closeModalCategory() {
    setModalCategory(false);
  }

  const memoizedImgSrc = useMemo(() => {
    if (dataCardapio?.length > 0 && imgSrc.length === 0) {
      const images = [];
      dataCardapio?.forEach(async (item) => {
        if (!item.ids) return;
        const img = await getImgCardapio(item.id, item.ids);
        setImgSrc((prevImgSrc) => [...prevImgSrc, img]);
        images.push(img);
      });
      return images;
    }
    return imgSrc;
  }, [dataCardapio, imgSrc]);

  const columns = [
    {
      title: "Ordem",
      dataIndex: "number",
      key: "number",
      sorter: {
        compare: (a, b) => a.number - b.number,
      },
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Preço",
      dataIndex: "price",
      key: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
      render: (_, text) => {
        return <p>R$ {Number(text.price).toFixed(2)}</p>;
      },
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (_, text) => {
        return (
          <div
            style={{
              overflow: "auto",
              height: 100,
              overflowX: "hidden",
              overflowY: "true",
              textOverflow: "ellipsis",
            }}
          >
            {text.description}
          </div>
        );
      },
    },
    {
      title: "Sub Descrição",
      dataIndex: "sub",
      key: "sub",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (_, text) => {
        return text.active ? (
          <Tag
            icon={<CheckCircleOutlined />}
            style={{
              padding: "10%",
              width: "100%",
              textAlign: "center",
            }}
            color="success"
          >
            Ativo
          </Tag>
        ) : (
          <Tag
            icon={<MinusCircleOutlined />}
            style={{
              padding: "10%",
              width: "100%",
              textAlign: "center",
            }}
            color="error"
          >
            Inativo
          </Tag>
        );
      },
    },
    {
      title: "Imagem",
      dataIndex: "img",
      key: "img",
      width: 160,
      render: (_, text) => {
        return memoizedImgSrc.map((img1, index) => (
          <div className="img" key={index}>
            {renderImageCarousel(img1, index, text.id)}
          </div>
        ));
      },
    },
    {
      title: "Destaque",
      dataIndex: "highlight",
      key: "highlight",
      sorter: { compare: (a, b) => a.highlight - b.highlight },
      render: (_, text) => {
        return (
          <Tag color={text.highlight ? "gold" : "grey"}>
            {text.highlight ? <StarFilled /> : <StarOutlined />}
          </Tag>
        );
      },
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
      sorter: {
        compare: (a, b) => a.category - b.category,
      },
    },
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Button
              ref={ref4}
              style={{ backgroundColor: "yellow" }}
              onClick={() => handleClickEdit(record)}
            >
              <EditOutlined
                size={24}
                style={{
                  borderRadius: 5,
                  padding: 5,
                  color: "#000",
                }}
              />
            </Button>

            <Popconfirm
              title="Tem certeza que deseja excluir essa tarefa?"
              onConfirm={() => confirmDelete(record)}
              okText="Excluir"
              okButtonProps={{ danger: true }}
              cancelText="Cancelar"
            >
              <Button ref={ref5} style={{ backgroundColor: "red" }}>
                <DeleteOutlined
                  size={24}
                  style={{
                    borderRadius: 5,
                    padding: 5,
                    color: "#fff",
                  }}
                />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const renderImageCarousel = (img, index, id) =>
    img[0]?.idreq === id && (
      <div className="img" key={index} style={{ zIndex: 5 }}>
        <LazyLoad key={index} offset={100}>
          <Image.PreviewGroup>
            <Carousel
              autoplay={true}
              autoplaySpeed={2000}
              showArrows={true}
              Swiping={true}
              draggable={true}
              effect="fade"
              dotPosition="bottom"
              style={{
                width: 100,
                maxWidth: 100,
                minWidth: "100px",
                color: "#fff",
              }}
            >
              {img
                .filter((img1) => img1.idreq && img1.idreq === id)
                .map((img1, index) => (
                  <Suspense key={index} fallback={<Spin />}>
                    <div style={{ width: 100, maxWidth: 100 }}>
                      <LazyLoadedImage
                        src={atob(img1.imagem)}
                        key={index}
                        style={{
                          borderRadius: 10,
                          color: "#fff",
                          minWidth: "100px",
                          objectFit: "cover",
                        }}
                        alt="img"
                        objectFit="cover"
                        width={100}
                        loading="lazy"
                      />
                    </div>
                  </Suspense>
                ))}
            </Carousel>
          </Image.PreviewGroup>
        </LazyLoad>
      </div>
    );

  const DeleteImage = async (id) => {
    await DeleteImg(id);
    message.success("Imagem deletada com sucesso!");
    setUptela(!uptela);
    setActionCardapio(!actionCardapio);
  };

  function handleChangeStatus(e) {
    const { value } = e.target;

    if (value === filteredStatus) {
      setFilteredStatus(null);
      localStorage.removeItem("filteredStatus");
    } else {
      setFilteredStatus(value);
      localStorage.setItem("filteredStatus", value);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("filteredStatus")) {
      setFilteredStatus(localStorage.getItem("filteredStatus"));
    }
  }, []);

  function handleRemoveStatus() {
    setFilteredStatus(null);
    localStorage.removeItem("filteredStatus");
  }

  const [openPop, setOpenPop] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpenPop(newOpen);
  };

  const content = (
    <div>
      <Button
        type="primary"
        style={{ width: 200 }}
        onClick={() =>
          window.open(`/home/${companySelectd.idcompany}/${company}`, "_blank")
        }
      >
        Pagina Inicial
      </Button>
      <Divider />
      <Button
        type="primary"
        title="Cardápio"
        onClick={() => window.open(`/Cozinha/${company}`, "_blank")}
      >
        Cozinheiro
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        title="Cardápio"
        onClick={() => window.open(`/Garçom/${company}`, "_blank")}
      >
        Garçom
      </Button>
    </div>
  );

  const downloadQRCode = () => {
    const canvas = document.getElementById("myqrcode")?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = `QRCode_${company}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="background-page" style={{ minHeight: "90vh" }}>
      <Row gutter={8}>
        <Button type="primary" onClick={() => setOpen(true)}>
          Tour
        </Button>
        <Popover
          content={
            <>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button
                  type="primary"
                  title="Cardápio"
                  onClick={() =>
                    window.open(
                      `/${
                        companySelectd.modo === 1 ? "Cardapio" : "Catalogo"
                      }/${companySelectd.idcompany}/${company}`,
                      "_blank"
                    )
                  }
                >
                  Ver {companySelectd.modo === 1 ? "Cardápio" : "Catálogo"}
                </Button>

                <Popover
                  content={content}
                  title={<label className="text">Entrar Como</label>}
                >
                  <Button type="primary" style={{ marginLeft: 10 }}>
                    Entrar Como
                  </Button>
                </Popover>
              </div>

              <Divider />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imgCache !== "undefined" ? (
                  <div id="myqrcode">
                    <QRCode
                      errorLevel="H"
                      value={`https://menu-digital.vercel.app/home/${companySelectd.idcompany}/${company}`}
                      icon={atob(JSON.parse(imgCache)) || null}
                      size={400}
                      iconSize={155}
                    />
                  </div>
                ) : (
                  <div id="myqrcode">
                    <QRCode
                      errorLevel="H"
                      value={`https://menu-digital.vercel.app/home/${companySelectd.idcompany}/${company}`}
                      size={400}
                    />
                  </div>
                )}
                <Divider />
                <Button type="primary" onClick={downloadQRCode}>
                  Baixar QRCode
                </Button>
              </div>
            </>
          }
          title={<label className="text">Opções</label>}
          trigger="click"
          open={openPop}
          onOpenChange={handleOpenChange}
          style={{ marginLeft: 10 }}
        >
          <div className="rgbButton">
            <a className="btn">
              <EyeOutlined />
            </a>
          </div>
        </Popover>

        <Divider />

        <Col span={24}>
          <Card bordered={false}>
            <>
              <Tour
                open={open}
                onClose={() => setOpen(false)}
                steps={steps}
                animated
              />
            </>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleShowModalNewAction}
                    ref={ref1}
                  >
                    Novo Item
                  </Button>
                </div>
              </Col>
              <Col span={24}>
                <Button
                  ref={ref4}
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => setModalCategory(!modalCategory)}
                >
                  Categoria
                </Button>
              </Col>
              <Col ref={ref2} span={24}>
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
              <Col span={2} />
              <Col ref={ref3}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Radio.Group buttonStyle="solid" value={filteredStatus}>
                    {dataCategory?.map((category, index) => (
                      <Radio.Button
                        key={index}
                        onClick={handleChangeStatus}
                        value={category.name}
                      >
                        {category.name}
                      </Radio.Button>
                    ))}

                    {filteredStatus !== null ? (
                      <Button
                        style={{
                          backgroundColor: "#fc5f5f",
                          color: "#000",
                        }}
                        onClick={handleRemoveStatus}
                      >
                        X
                      </Button>
                    ) : (
                      ""
                    )}
                  </Radio.Group>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {!isMobile && (
        <Table
          dataSource={searchData}
          columns={columns}
          footer={() => "Total de itens: " + searchData?.length}
          size="small"
          sticky={{
            offsetHeader: 0,
          }}
        />
      )}
      {isMobile && (
        <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
          {searchData.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card className="card-mobile" title={item.name} bordered={true}>
                <Tag
                  color={item.active ? "green" : "red"}
                  key={item.id}
                  size="large"
                  style={{ fontSize: 20 }}
                >
                  {item.active ? "Ativo" : "Desativado"}
                </Tag>
                <p>Preço: R$ {Number(item.price).toFixed(2)}</p>
                <p>Descrição: </p>
                {item.description}
                <p>Sub Descrição: {item.sub}</p>

                <p>Categoria: {item.category}</p>
                <p>
                  Destaque: {item.highlight ? <StarFilled /> : <StarOutlined />}
                </p>
                <div>
                  {memoizedImgSrc.map((img1, index) => (
                    <div className="img" key={index}>
                      {img1.map(
                        (img, index) =>
                          item.id === img.idreq &&
                          (totalImg === 0 ? setTotalImg(img1.length) : null,
                          (
                            <>
                              <img
                                src={atob(img.imagem)}
                                alt="img"
                                style={{
                                  width: 100,
                                  marginRight: 5,
                                  borderRadius: 10,
                                }}
                              />

                              <Popconfirm
                                title="Tem certeza que deseja excluir essa imagem?"
                                onConfirm={() => confirmDeleteImg(img)}
                                okText="Excluir"
                                okButtonProps={{ danger: true }}
                                cancelText="Cancelar"
                              >
                                <Button
                                  ref={ref5}
                                  style={{
                                    backgroundColor: "#fc5f5f",
                                    width: 20,
                                    position: "absolute",
                                    marginLeft: -35,
                                  }}
                                >
                                  <DeleteOutlined
                                    size={24}
                                    style={{
                                      color: "#fff",
                                      marginLeft: -7,
                                    }}
                                  />
                                </Button>
                              </Popconfirm>
                            </>
                          ))
                      )}
                    </div>
                  ))}
                </div>
                <Space>
                  <Button
                    ref={ref4}
                    style={{ backgroundColor: "yellow" }}
                    onClick={() => handleClickEdit(item)}
                  >
                    <EditOutlined
                      size={24}
                      style={{
                        borderRadius: 5,
                        padding: 5,
                        color: "#000",
                      }}
                    />
                  </Button>

                  <Popconfirm
                    title="Tem certeza que deseja excluir essa tarefa?"
                    onConfirm={() => confirmDelete(item)}
                    okText="Excluir"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancelar"
                  >
                    <Button ref={ref5} style={{ backgroundColor: "red" }}>
                      <DeleteOutlined
                        size={24}
                        style={{
                          borderRadius: 5,
                          padding: 5,
                          color: "#fff",
                        }}
                      />
                    </Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={modalNewAction}
        okButtonProps={{ disabled: disableSave() }}
        okText={"Salvar"}
        onOk={handleSave}
        onCancel={closeModal}
        title={selectedTaskId ? "Atualizar Item" : "Novo Item"}
      >
        <Row justify="center">
          <Col span={20}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                N°
              </Typography.Title>

              <Input
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                type="number"
                placeholder="N°"
                value={number !== 0 ? number : undefined}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                Nome
              </Typography.Title>

              <Input
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                Preço
              </Typography.Title>
              <Input
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                placeholder="Preço"
                type="number"
                value={price !== "" ? price : undefined}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                Descrição
              </Typography.Title>
              <Input
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                Sub Descrição
              </Typography.Title>
              <Input
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                placeholder="Sub Descrição"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 150 }}>
                Ativo?
              </Typography.Title>
              <Select
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                dropdownMatchSelectWidth={false}
                showSearch
                placeholder="Ativo"
                optionFilterProp="children"
                onChange={(value) => setActive(value)}
                value={active}
              >
                <Option key={1} value={true}>
                  Sim
                </Option>
                <Option key={2} value={false}>
                  Não
                </Option>
              </Select>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 100 }}>
                Destaque
              </Typography.Title>
              <Switch
                value={highlight}
                checkedChildren="Sim"
                unCheckedChildren="Não"
                onChange={(value) => setHighlight(value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "baseline" }}>
              <Typography.Title level={5} style={{ width: 170 }}>
                Categoria
              </Typography.Title>
              <Select
                style={{ width: "100%", margin: "10px 0" }}
                size="large"
                showSearch
                placeholder="Categoria"
                optionFilterProp="children"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {dataCategory?.map((category, index) => (
                  <Option key={index} value={category.name}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              {memoizedImgSrc.map((img1, index) => (
                <div className="img" key={index}>
                  {img1.map(
                    (img, index) =>
                      selectedTaskId === img.idreq &&
                      (totalImg === 0 ? setTotalImg(img1.length) : null,
                      (
                        <>
                          <img
                            src={atob(img.imagem)}
                            alt="img"
                            style={{
                              width: 100,
                              marginRight: 5,
                              borderRadius: 10,
                            }}
                          />
                          <Popconfirm
                            title="Tem certeza que deseja excluir essa imagem?"
                            onConfirm={() => confirmDeleteImg(img)}
                            okText="Excluir"
                            okButtonProps={{ danger: true }}
                            cancelText="Cancelar"
                          >
                            <Button
                              ref={ref5}
                              style={{
                                backgroundColor: "#fc5f5f",
                                width: 20,
                                position: "absolute",
                                marginLeft: -35,
                              }}
                            >
                              <DeleteOutlined
                                size={24}
                                style={{
                                  color: "#fff",
                                  marginLeft: -7,
                                }}
                              />
                            </Button>
                          </Popconfirm>
                        </>
                      ))
                  )}
                </div>
              ))}
            </div>
            <div>
              {totalImg < 3 && selectedTaskId && (
                <ImgCrop>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={(e) => onChange(e)}
                    onPreview={onPreview}
                    accept="image/*"
                  >
                    {fileList.length < 1 && "+add Imagem"}
                  </Upload>
                </ImgCrop>
              )}
            </div>
          </Col>
        </Row>
      </Modal>
      <Modal
        open={modalCategory}
        okText={"Salvar"}
        onOk={closeModalCategory}
        onCancel={closeModalCategory}
        title={"Categoria"}
        closable={false}
        footer={null}
      >
        <Category />
      </Modal>
      <Modal
        open={modalImgVisible}
        onCancel={closeModal}
        footer={null}
        width={"90vw"}
      >
        <img src={imgModal} alt="img" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
}
