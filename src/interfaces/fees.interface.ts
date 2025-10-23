enum FeeType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
}
export interface CreateFeeInterface {
    name: string;
    type: FeeType;
    amount: number;
}
export interface FeeInterface extends CreateFeeInterface {
    id: string;
    createdAt: string | Date;
}
