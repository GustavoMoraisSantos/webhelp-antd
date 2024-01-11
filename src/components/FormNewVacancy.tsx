import { useJobContext } from "@/context/JobContext";
import { Button, Form, Input, Radio, Rate, message } from "antd";
import {  useState } from "react";

const { TextArea } = Input;

interface Job {
  job: string;
  nivel: string;
  description: string;
  technologies: { name: string; ratingRequired: number }[];
  createdAt: string;
}

const FormNewVacancy = ({ onFinishForm }: { onFinishForm: () => void }) => {
  const { addJob } = useJobContext();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [technologies, setTechnologies] = useState<{ name: string; ratingRequired: number }[]>([]);

  const mountPayload = (values: any, technologies: { name: string; ratingRequired: number }[]) => {
    const createdAt = new Date();
    const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}/${(createdAt.getMonth() + 1).toString().padStart(2, '0')}/${createdAt.getFullYear()}`;
    
    const newPayload: Job = {
      job: values.vacation,
      nivel: values.nivel,
      description: values.description,
      technologies: technologies,
      createdAt: formattedDate
    };
  
    // Adicionando o novo emprego ao contexto
    addJob(newPayload);
  
  };

  const handleAddTechnology = () => {
    const technology = form.getFieldValue("technologies");

    if (technology) {
      setTechnologies([...technologies, { name: technology, ratingRequired: 0 }]);
      form.resetFields(["technologies"]);
    }
  };

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'A vaga foi criada com sucesso!',
    });
  };

  const onFinish = (values: any) => {
    success();
    form.resetFields();
    mountPayload(values, technologies);
    setTechnologies([]);  
    onFinishForm();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleRatingChange = (name: string, value: number) => {
    const updatedTechnologies = technologies.map((tech) =>
      tech.name === name ? { ...tech, ratingRequired: value } : tech
    );

    setTechnologies(updatedTechnologies);
  };

  return (
    <Form
      layout={"vertical"}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {contextHolder}
      <Form.Item
        label="Nível desejado:"
        name="nivel"
        rules={[{ required: true, message: "Selecione o nível desejado!" }]}
      >
        <Radio.Group>
          <Radio.Button value="junior">Júnior</Radio.Button>
          <Radio.Button value="pleno">Pleno</Radio.Button>
          <Radio.Button value="senior">Sênior</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Nome da função:"
        name="vacation"
        rules={[{ required: true, message: "Descreva o título do cargo!" }]}
      >
        <Input placeholder="Ex. Desenvolvedor Full Stack" />
      </Form.Item>
      <Form.Item name="technologies" label="Tecnologias da vaga:">
        <div style={{ display: "flex", gap: "16px" }}>
          <Input placeholder="Ex. React.js" />
          <Button onClick={handleAddTechnology}>Adicionar</Button>
        </div>
      </Form.Item>
      {technologies.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <p style={{ fontWeight: "bold", color: "#aaaaaa" }}>
              Defina o peso de cada tecnologia
            </p>
          </div>
          {technologies.map((technology, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
              {technology.name}
              <Form.Item label="">
                <Rate onChange={(value) => handleRatingChange(technology.name, value)} />
              </Form.Item>
            </div>
          ))}
        </>
      )}


      <Form.Item
        name={"description"}
        style={{ marginTop: "16px" }}
        label="Descrição da vaga:"
      >
        <TextArea placeholder="Descrição das atribuições, tecnologias e afins." />
      </Form.Item>
      <Form.Item>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit">
            Salvar vaga
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormNewVacancy;
