import { IndicatorStatus } from "@prisma/client";
import { Badge } from "./ui/badge";

const StatusBadge = ({ status }: { status: IndicatorStatus }) => {
  switch (status) {
    case IndicatorStatus.CONCLUIDO:
      return (
        <Badge variant="outline" className="border-green-700 text-green-700">
          Concluído
        </Badge>
      );
    case IndicatorStatus.EM_EDICAO:
      return (
        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
          Em Edição
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-red-600 text-red-600">
          Não atingido
        </Badge>
      );
  }
};

export default StatusBadge;