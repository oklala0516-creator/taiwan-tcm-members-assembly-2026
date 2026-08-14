export type FeeInput = {
  member: boolean;
  transport: "self" | "shuttle";
  training: boolean;
  dinner: boolean;
};

export const calculateFee = (input: FeeInput) => {
  if (input.member) return input.transport === "shuttle" ? 600 : 500;
  return (input.training ? 1000 : 0) + (input.dinner ? 1000 : 0);
};
