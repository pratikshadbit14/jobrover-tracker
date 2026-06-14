export type ApplicationStatus =
  | "saved"
  | "applied"
  | "screened"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface User {
  id: string;
  email: string;
  full_name: string;
  current_title: string | null;
}

export interface Application {
  id: string;
  job_title: string;
  company_name: string;
  company_id: string | null;
  status: ApplicationStatus;
  applied_date: string | null;
  source: string | null;
  is_remote: boolean;
  created_at: string;
  updated_at: string;
  // detail fields
  job_description?: string | null;
  source_url?: string | null;
  cover_letter?: string | null;
  salary_expected?: number | null;
  salary_offered?: number | null;
  location?: string | null;
  notes?: string | null;
  resume_id?: string | null;
}

export interface Interview {
  id: string;
  application_id: string;
  round_type: string;
  scheduled_at: string | null;
  completed_at: string | null;
  interviewer: string | null;
  outcome: string;
  feedback: string | null;
  prep_notes: string | null;
  created_at: string;
}

export interface Followup {
  id: string;
  application_id: string;
  due_date: string;
  status: string;
  draft_body: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  label: string;
  file_url: string | null;
  is_default: boolean;
  created_at: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  from_status: string | null;
  to_status: string;
  changed_at: string;
  note: string | null;
}

export interface AIOutput {
  id: string;
  application_id: string;
  output_type: string;
  content: string;
  model_used: string;
  created_at: string;
}