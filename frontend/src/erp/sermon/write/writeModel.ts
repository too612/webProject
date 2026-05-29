export type SermonWritePayload = {
  title: string;
  preacher: string;
  scripture: string;
  content: string;
  sermonDate: string;
};

export type SermonWriteForm = SermonWritePayload;

export const INITIAL_SERMON_WRITE_FORM: SermonWriteForm = {
  title: '',
  preacher: '',
  scripture: '',
  content: '',
  sermonDate: '',
};
