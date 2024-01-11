import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Rate, Divider, Tag, message } from "antd";
import { useJobContext } from "@/context/JobContext";
import { Job } from "@/Utils/interfaces";
import { v4 as uuidv4 } from "uuid";

interface NewCandidateModalProps {
  open: boolean;
  jobId: any;
  onClose: () => void;
}

const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  open,
  jobId,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const [requirements, setRequirements] = useState<
    { name: string; weight: number }[]
  >([]);
  const [rateValues, setRateValues] = useState<{ [key: string]: number }>({});
  const { jobs, updateJob } = useJobContext();
  const [messageApi, contextHolder] = message.useMessage();

  const calculatePontuation = (technologies: any[], rateValues: any) => {
    let totalPontuation = 0;

    technologies.forEach((technology) => {
      const technologyName = technology.name;
      const rating = rateValues[technologyName] || 0;
      const weight = technology.ratingRequired;
      const technologyPontuation = rating * weight;

      totalPontuation += technologyPontuation;
    });

    return totalPontuation;
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Candidato salvo com sucesso!",
    });
  };

  const onFinish = (values: any) => {
    const pontuation = calculatePontuation(job?.technologies || [], rateValues);

    const updatedJobs = jobs.map((j) =>
      j.id === jobId
        ? {
            ...j,
            candidates: [
              ...(j.candidates || []),
              {
                id: uuidv4(),
                candidateName: values.candidateName,
                contact: values.contact,
                linkedin: values.linkedin,
                observations: values.observations,
                pontuation: pontuation,
              },
            ],
          }
        : j
    );

    updateJob(updatedJobs);
    setRateValues({});
    success();
    onClose();
  };

  const job: Job | undefined = jobs.find((job) => job.id === jobId);

  const handleRatingChange = (requirementName: string, value: number) => {
    const updatedRequirements = requirements.map((req) =>
      req.name === requirementName ? { ...req, weight: value } : req
    );

    setRequirements(updatedRequirements);
    setRateValues((prevValues) => ({
      ...prevValues,
      [requirementName]: value,
    }));
  };

  useEffect(() => {
    setRequirements([]);
    form.resetFields();
  }, [open, form]);

  return (
    <>
      <Modal
        open={open}
        title={`Cadastro de candidato`}
        onCancel={() => {
          setRequirements([]);
          setRateValues({});
          form.resetFields();
          onClose();
        }}
        footer={[]}
      >
        {contextHolder}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3> {job?.job} </h3>
          <Tag color="blue" style={{ marginLeft: "12px" }}>
            {job?.nivel}
          </Tag>
        </div>
        <Divider />
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Nome do candidato"
            name="candidateName"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do candidato!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contato"
            name="contact"
            rules={[
              {
                required: true,
                message: "Por favor, insira as informações de contato!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="LinkedIn" name="linkedin">
            <Input />
          </Form.Item>

          <Form.Item label="Observações" name="observations">
            <TextArea rows={3} />
          </Form.Item>

          <div style={{ marginBottom: "16px" }}>
            <h3>Requisitos:</h3>
            {job?.technologies?.map((requirement, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  marginTop: "16px",
                }}
              >
                {requirement.name}
                <Form.Item label="" key={i}>
                  <Rate
                    value={rateValues[requirement.name] || 0}
                    onChange={(value) =>
                      handleRatingChange(requirement.name, value)
                    }
                  />
                </Form.Item>
              </div>
            ))}
          </div>
          <Divider />
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => onClose()} style={{ marginRight: "8px" }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Salvar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NewCandidateModal;
