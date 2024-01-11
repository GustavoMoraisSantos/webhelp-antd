import Head from "next/head";
import styles from "@/styles/Home.module.css";
import {
  Button,
  Drawer,
  Input,
  Layout,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Image from "next/image";
import Logo from "../../public/web-help-logo.png";
import { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import FormNewVacancy from "@/components/FormNewVacancy";
import { useJobContext } from "@/context/JobContext";
import NewCandidateModal from "@/components/ModalNewCandidate";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
interface DataType {
  key: string;
  name: string;
  createdAt: string;
}

export default function Home() {
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const [visibleModalCandidate, setVisibleModalCandidate] =
    useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<any>({});
  const { jobs, deleteJob } = useJobContext();
  const [modal, contextHolder] = Modal.useModal();

  const getTagColor = (nivel: string) => {
    return nivel === "junior" ? "green" : nivel === "pleno" ? "blue" : "red";
  };

  const jobsData = jobs.map((job) => ({
    key: job.id,
    name: `${job.job}`,
    createdAt: job.createdAt,
    levelTag: <Tag color={getTagColor(job.nivel)}>{job.nivel}</Tag>, // Adicione esta linha
  }));

  const confirm = (record: any) => {
    modal.confirm({
      title: "Confirmação",
      content: `Deseja realmente excluir a vaga ${record.name}?`,
      okText: "Excluir",
      cancelText: "Cancelar",
      onOk: () => deleteJob(record.key),
    });
  };

  const handleAddCandidate = (record: any) => {
    setVisibleModalCandidate(true);
    setSelectedJob(record);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Nome da vaga",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Nível",
      dataIndex: "levelTag",
      key: "levelTag",
    },
    {
      title: "Data de abertura",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ações",
      key: "action",
      width: "100px",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Adicionar novo candidato">
            <PlusCircleOutlined
              onClick={() => handleAddCandidate(record)}
              className={styles.actionIcon}
            />
          </Tooltip>
          <Tooltip title="Visualizar candidatos da vaga">
            <EyeOutlined className={styles.actionIcon} />
          </Tooltip>
          <Tooltip title="Excluir vaga">
            <DeleteOutlined
              onClick={() => confirm(record)}
              className={styles.actionIcon}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Web Help - RH!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/web-help-logo.png" />
      </Head>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image alt="logo web help" src={Logo} width={86} height={undefined} />
          <p
            style={{
              color: "whitesmoke",
              fontSize: "20px",
              marginLeft: "24px",
            }}
          >
            Sistema de Seleção - Gustavo Morais
          </p>
        </Header>
        <Content className={styles.content}>
          <div
            style={{
              margin: "16px 0",
              padding: "12px 24px",
              minHeight: 380,
              height: "100%",
              background: "white",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Search
                placeholder="Procure pelo nome da vaga"
                style={{ width: "300px" }}
              />
              <Button type="primary" onClick={() => setIsVisibleDrawer(true)}>
                Cadastrar nova vaga
              </Button>
            </div>

            <Table columns={columns} dataSource={jobsData} />
            {contextHolder}
          </div>
          <Drawer
            title="Cadastro de vaga"
            placement="right"
            onClose={() => setIsVisibleDrawer(false)}
            open={isVisibleDrawer}
            width={500}
          >
            <FormNewVacancy onFinishForm={() => setIsVisibleDrawer(false)} />
          </Drawer>
          {/* @ts-ignore */}
          <NewCandidateModal
            open={visibleModalCandidate}
            jobId={selectedJob.key}
            onClose={() => setVisibleModalCandidate(false)}
          />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {new Date().getFullYear()} Created by Gustavo Morais
        </Footer>
      </Layout>
    </>
  );
}
