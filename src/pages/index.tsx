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
import ListCandidatesByJob from "@/components/ModalCandidateByJob";
import { getSession, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
interface DataType {
  key: string;
  name: string;
  createdAt: string;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    // Se nao tem user a gente redireciona para /
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Home() {
  const { data: session, status } = useSession();

  const { jobs, deleteJob } = useJobContext();
  const [modal, contextHolder] = Modal.useModal();
  const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
  const [visibleModalCandidate, setVisibleModalCandidate] =
    useState<boolean>(false);
  const [openCandidatesList, setOpenCandidatesList] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const getTagColor = (nivel: string) => {
    return nivel === "junior" ? "green" : nivel === "pleno" ? "blue" : "red";
  };

  const jobsData = jobs.map((job) => ({
    key: job.id,
    name: `${job.job}`,
    createdAt: job.createdAt,
    levelTag: <Tag color={getTagColor(job.nivel)}>{job.nivel}</Tag>,
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
  const handleListCandidates = (record: any) => {
    setOpenCandidatesList(true);
    setSelectedJob(record);
  };
  const filteredData = jobsData.filter((job) =>
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<DataType> = [
    {
      title: "Nome da vaga",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleListCandidates(record)}>{text}</a>
      ),
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
            <EyeOutlined
              onClick={() => handleListCandidates(record)}
              className={styles.actionIcon}
            />
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
        <Header className={styles.headerContainer}>
          <Image alt="logo web help" className={styles.logoImage} src={Logo} />
          <p className={styles.headerText}>
            Sistema de Seleção
          </p>
          {status === "loading" ? (
            <></>
          ) : session && (
            <Button type="primary" danger ghost className={styles.loginButton} onClick={() => signOut()}>
              Sair
            </Button>
          ) }
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
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
              <Button type="primary" onClick={() => setIsVisibleDrawer(true)}>
                Cadastrar nova vaga
              </Button>
            </div>

            <Table columns={columns} dataSource={filteredData} />
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

          <ListCandidatesByJob
            open={openCandidatesList}
            jobId={selectedJob.key}
            onClose={() => setOpenCandidatesList(false)}
          />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {new Date().getFullYear()} Created by Gustavo Morais
        </Footer>
      </Layout>
    </>
  );
}
