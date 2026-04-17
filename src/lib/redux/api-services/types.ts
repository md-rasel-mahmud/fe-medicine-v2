export type ApiListResponse<T> = {
  result: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalData: number;
  };
};

export type ApiItemResponse<T> = {
  result: T;
  message?: string;
};

export type DashboardReportItem = {
  total?: number;
  date?: string;
};

export type DashboardResultType = {
  totalMedicines: number;
  totalSaleToCustomer: number;
  totalPurchaseFromSupplier: number;
  totalSupplier: number;
  totalUser: number;
  totalStock: { total: number } | null;
  report?: {
    filter: string;
    sale?: DashboardReportItem | null;
    purchase?: DashboardReportItem | null;
    stockAmount?: DashboardReportItem | null;
  };
};

export type MedicineType = {
  _id?: string;
  name: string;
  groupName: string;
  brandName?: string;
  unit?: string;
  selfNo?: string;
  price: {
    unitPrice: number;
    boxPrice?: number;
  };
};

export type UnitType = {
  _id?: string;
  name: string;
  description?: string;
};

export type SupplierType = {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  description?: string;
};

export type StockMedicineType = {
  medicine: MedicineType | string;
  quantity: number;
  expireDate: string;
};

export type StockType = {
  _id?: string;
  medicines: StockMedicineType[];
  stockAddedAt?: string;
};

export type PurchaseType = {
  _id?: string;
  purchaseDate: string;
  purchaseNo: string;
  totalAmount: number;
  description: string;
  stocks: StockMedicineType[];
  supplier: SupplierType | string;
  shippingCost: number;
  globalDiscount: number;
};

export type SaleMedicineType = {
  medicine: MedicineType | string;
  saleQuantity: number;
  stockAddedAt?: string;
};

export type SaleType = {
  _id?: string;
  invoiceNo: string;
  totalAmount: number;
  discount: number;
  description: string;
  customerName: string;
  medicines: SaleMedicineType[];
};
