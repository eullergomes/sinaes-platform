interface StatusBadgeProps {
  status: 'Concluído' | 'Em edição' | 'Não atingido' | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let colorClasses = '';

  switch (status) {
    case 'Concluído':
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'Em edição':
      colorClasses = 'bg-yellow-100 text-yellow-700';
      break;
    case 'Não atingido':
      colorClasses = 'bg-red-100 text-red-700';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-700';
      break;
  }

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-semibold ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
