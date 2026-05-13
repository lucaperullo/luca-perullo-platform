export type FicCreateInvoicePayload = {
  data: {
    type: "invoice" | "quote";
    numeration: string;
    subject: string;
    visible_subject: string;
    rc_center: string;
    notes: string;
    rivalsa: number;
    rivalsa_taxable: number;
    cassa: number;
    cassa_taxable: number;
    cassa2: number;
    cassa2_taxable: number;
    global_cassa_taxable: number;
    withholding_tax: number;
    withholding_tax_taxable: number;
    other_withholding_tax: number;
    stamp_duty: number;
    payment_method: { id?: number; name: string };
    use_split_payment: false;
    use_gross_prices: false;
    e_invoice: true;
    ei_data: { payment_method: "MP05" };
    entity: {
      name: string;
      vat_number?: string;
      tax_code?: string;
      address_street: string;
      address_postal_code: string;
      address_city: string;
      address_province: string;
      country: string;
      ei_code: string;
      certified_email?: string;
    };
    items_list: Array<{
      product_id?: number;
      code?: string;
      name: string;
      description?: string;
      qty: number;
      net_price: number;
      vat: {
        id?: number;
        value: 0;
        description: string;
        ei_type: "N2.2";
        ei_description: string;
      };
      stock?: false;
    }>;
    payments_list: Array<{
      due_date: string;
      amount: number;
      payment_terms: { days: 0; type: "standard" };
      status: "not_paid";
    }>;
  };
};

export type FicDocumentResponse = {
  data: { id: number; number: string };
};

export type FicEInvoiceStatus =
  | "not_sent"
  | "sent"
  | "delivered"
  | "rejected"
  | "no_recipient";
