// Type definitions for the ParaBank application domain

export interface ParabankCredentials {
  username: string;
  password: string;
}

export interface ParabankPayee {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  accountNumber: string;
  verifyAccountNumber: string;
}

export interface ParabankTestData {
  credentials: ParabankCredentials;
  newAccount: {
    accountType: string;
    fromAccountId: string;
  };
  accountActivity: {
    transactionType: string;
  };
  transfer: {
    amount: string;
    fromAccountId: string;
    toAccountId: string;
  };
  billPay: {
    payee: ParabankPayee;
    amount: string;
  };
  findTransaction: {
    amount: string;
  };
  contactInfo: {
    lastName: string;
    street: string;
  };
  loanRequest: {
    amount: string;
    downPayment: string;
    fromAccountId: string;
  };
}
