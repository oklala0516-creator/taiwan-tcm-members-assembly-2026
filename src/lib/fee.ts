export type FeeInput = {
  member: boolean;
  transport: "self" | "shuttle";
  training: boolean;
  dinner: boolean;
};

export const calculateFee = (input: FeeInput) => {
  const trainingFee = input.training ? (input.member ? 500 : 1000) : 0;
  const dinnerFee = input.dinner && !input.member ? 1000 : 0;
  const shuttleFee = input.transport === "shuttle" ? 100 : 0;

  return trainingFee + dinnerFee + shuttleFee;
};
