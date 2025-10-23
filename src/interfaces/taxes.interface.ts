enum TaxType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
}
export interface CreateTaxInterface {
    name: string;
    type: TaxType;
    amount: number;
}
export interface TaxInterface extends CreateTaxInterface {
    id: string;
    createdAt: string | Date;
}
