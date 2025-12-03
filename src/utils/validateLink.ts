const urlRegex = /^(https?:\/\/)?([\w.-]+\.)+[\w.-]+(\/[\w\-./?%&=]*)?$/;

export const validateLink = (url: string, setLinkErrors: React.Dispatch<React.SetStateAction<string[]>>, index = 0): boolean => {
  const isInvalid = !!url && !urlRegex.test(url);

  setLinkErrors((prev) => {
    const next = [...prev];
    next[index] = isInvalid ? 'Link inválido' : '';
    return next;
  });

  return !isInvalid;
};