export type ApplicationStatus = 'draft';

export class Application {
  id: string;
  status: ApplicationStatus;
  first_name: string;
  last_name: string;
  email: string;
  loan_amount: number;
}
