export type ApplicationStatus = 'draft'

export interface Application {
  id: string
  status: ApplicationStatus
  first_name: string
  last_name: string
  email: string
  loan_amount: number
}

export interface CreateApplicationDTO {
  first_name: string
  last_name: string
  email: string
  loan_amount: number
}
