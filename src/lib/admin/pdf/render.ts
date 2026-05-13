import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";

export async function pdfBuffer(element: any): Promise<Buffer> {
  return await renderToBuffer(element);
}
