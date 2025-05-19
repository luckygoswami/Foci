export interface Group {
  id: string;
  name: string;
  createdAt: number;
  createdBy: string;
  members: string[];
  admins: string[];
}
