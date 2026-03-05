import { ExtractedDocument } from "@/lib/api";

export interface Debtor {
  id: string;
  name: string;
  xmlCount: number;
  emails: string[];
  sustentos: File[];
  documents: ExtractedDocument[];
}