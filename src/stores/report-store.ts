import { create } from 'zustand';

export interface ImportedDataItem {
  id: string;
  metricType: string;
  title: string;
  chartData: Record<string, unknown>[];
  tableData: Record<string, unknown>[];
}

interface ReportState {
  ccList: string[];
  subject: string;
  versionInfo: { platform: string; product: string; version: string };
  topIssues: string;
  importedData: ImportedDataItem[];
  contentHtml: string;

  setCcList: (list: string[]) => void;
  addCc: (email: string) => void;
  removeCc: (email: string) => void;
  setSubject: (subject: string) => void;
  setVersionInfo: (info: {
    platform: string;
    product: string;
    version: string;
  }) => void;
  setTopIssues: (issues: string) => void;
  setImportedData: (data: ImportedDataItem[]) => void;
  addImportedData: (item: ImportedDataItem) => void;
  removeImportedData: (id: string) => void;
  reorderImportedData: (oldIndex: number, newIndex: number) => void;
  setContentHtml: (html: string) => void;
  reset: () => void;
}

const initialState = {
  ccList: [] as string[],
  subject: '',
  versionInfo: { platform: '', product: '', version: '' },
  topIssues: '',
  importedData: [] as ImportedDataItem[],
  contentHtml: '',
};

export const useReportStore = create<ReportState>((set) => ({
  ...initialState,

  setCcList: (list) => set({ ccList: list }),

  addCc: (email) =>
    set((state) => ({
      ccList: state.ccList.includes(email)
        ? state.ccList
        : [...state.ccList, email],
    })),

  removeCc: (email) =>
    set((state) => ({
      ccList: state.ccList.filter((e) => e !== email),
    })),

  setSubject: (subject) => set({ subject }),

  setVersionInfo: (info) => set({ versionInfo: info }),

  setTopIssues: (issues) => set({ topIssues: issues }),

  setImportedData: (data) => set({ importedData: data }),

  addImportedData: (item) =>
    set((state) => ({
      importedData: [...state.importedData, item],
    })),

  removeImportedData: (id) =>
    set((state) => ({
      importedData: state.importedData.filter((d) => d.id !== id),
    })),

  reorderImportedData: (oldIndex, newIndex) =>
    set((state) => {
      const updated = [...state.importedData];
      const [item] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, item);
      return { importedData: updated };
    }),

  setContentHtml: (html) => set({ contentHtml: html }),

  reset: () => set({ ...initialState }),
}));
