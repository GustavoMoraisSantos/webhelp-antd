import { useJobContext } from "@/context/JobContext";
import { Divider, Empty, Modal, Progress } from "antd";

interface ListCandidatesByJobProps {
  open: boolean;
  jobId: any;
  onClose: () => void;
}

const ListCandidatesByJob: React.FC<ListCandidatesByJobProps> = ({
  open,
  jobId,
  onClose,
}) => {
  const { jobs } = useJobContext();

  const job = jobs.find((j) => j.id === jobId);

  const calculateCompatibility = (
    pontuation: number,
    maxPontuation: number
  ) => {
    return (pontuation / maxPontuation) * 100;
  };

  const maxPontuation = job?.technologies.reduce(
    (acc, tech) => acc + tech.ratingRequired * tech.ratingRequired,
    0
  );

  return (
    <Modal open={open} onCancel={() => onClose()} footer={[]} width={1000}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>
          Candidatos cadastrados - {job?.job}, nível {job?.nivel}
        </h3>
      </div>
      <Divider />
      {job?.candidates ? (
        job?.candidates?.map((candidate) => (
          <div key={candidate.id} style={{ display: "flex", width: "100%" }}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "70%",
              }}
            >
              {candidate?.candidateName} - Contato: {candidate.contact} -  pontuação: {candidate.pontuation}
            </div>

            <Progress
              percent={
                candidate.pontuation
                  ? parseFloat(
                      calculateCompatibility(
                        candidate.pontuation,
                        maxPontuation as number
                      ).toFixed(2)
                    )
                  : 0
              }
              status="active"
            />
          </div>
        ))
      ) : (
        <Empty />
      )}
    </Modal>
  );
};

export default ListCandidatesByJob;
